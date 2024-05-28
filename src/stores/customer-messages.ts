import { defineStore } from "pinia"
import Ably from "ably"
import { useSessionStore } from "./session"
import httpClient from "~/modules/httpClient"

type Message = Ably.Types.Message

type AblyError = string | Ably.Types.ErrorInfo | null

enum MessageTimeRange {
  PER_DAY = "per_day",
  PER_WEEK = "per_week",
  TOTAL = "total",
}

enum TimeRange {
  PER_DAY = "perDay",
  PER_WEEK = "perWeek",
  TOTAL = "total",
}

const TIME_RANGE_TO_CAMEL = {
  [MessageTimeRange.PER_DAY]: TimeRange.PER_DAY,
  [MessageTimeRange.PER_WEEK]: TimeRange.PER_WEEK,
  [MessageTimeRange.TOTAL]: TimeRange.TOTAL,
}

type StatsMessageData = {
  projectId: string
  timeRange: MessageTimeRange
  shortUrlsAccessed: number
  shortUrlsAccessedPreviousPeriod?: number
  startDate: string
}

export type ProjectStatisticData = {
  shortUrlsAccessed: number
  shortUrlsAccessedPreviousPeriod?: number
  startDate: string
}

export type ProjectStatistic = {
  [key in TimeRange]?: ProjectStatisticData
}

type ProjectStats = {
  [projectId: string]: ProjectStatistic
}

const CUSTOMER_CHANNEL_PREFIX = "customer"
const PROJECT_STATS_MESSAGE_NAME = "projectStats"

const createTokenRequest = async () => {
  const sessionStore = useSessionStore()
  const customerId = sessionStore.getSelectedCustomerId
  const tokenRequest = await httpClient.post("/websocket/refreshToken", {
    customerId,
  })
  return tokenRequest.data
}

export const useCustomerMessagesStore = defineStore(
  "customerMessagesStore",
  () => {
    const sessionStore = useSessionStore()
    const selectedCustomerId = ref(sessionStore.getSelectedCustomerId)
    const messagesProvider = ref()
    const currentChannel = ref()
    const projectStats = ref({} as ProjectStats)

    const getProjectStats = computed(() => projectStats.value)

    const getCurrentChannel = computed(() => !!currentChannel.value)

    watch(
      [selectedCustomerId, messagesProvider],
      async ([id, provider]) => {
        if (!provider) {
          return
        }

        currentChannel.value && (await currentChannel.value.detach())

        if (id) {
          currentChannel.value = messagesProvider.value.channels.get(
            `${CUSTOMER_CHANNEL_PREFIX}:${id}`,
          )
        }
      },
      { immediate: true },
    )

    async function openConnection() {
      // do not open new connection if one already exists
      if (messagesProvider.value) {
        return
      }

      const provider = new Ably.Realtime.Promise({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        authCallback: async (tokenParams, callback) => {
          try {
            const tokenRequest = await createTokenRequest()
            callback(null, tokenRequest)
          } catch (error) {
            // eslint-disable-next-line node/no-callback-literal
            callback(error as AblyError, null)
          }
        },
        queryTime: true,
      })
      await provider.connection.once("connected")

      messagesProvider.value = provider
    }

    async function closeConnection() {
      if (!messagesProvider.value) {
        return
      }

      messagesProvider.value.close()
      await messagesProvider.value.connection.once("closed")
    }

    function constructProjectStats({
      projectId,
      timeRange,
      shortUrlsAccessed,
      shortUrlsAccessedPreviousPeriod,
      startDate,
    }: StatsMessageData): ProjectStats {
      const prevStats = projectStats.value?.[projectId] || {}
      // TODO consider checking startDate - if we use proper
      // stats for a given timerange (e.g. today, not yesterday)

      return {
        [projectId]: {
          ...prevStats,
          [TIME_RANGE_TO_CAMEL[timeRange]]: {
            startDate,
            shortUrlsAccessed,
            ...(shortUrlsAccessedPreviousPeriod
              ? { shortUrlsAccessedPreviousPeriod }
              : {}),
          },
        },
      }
    }

    async function subscribeProjectStatsMessages(projectId: string) {
      if (!currentChannel.value) {
        return
      }

      await currentChannel.value.subscribe((message: Message) => {
        if (
          message.name === PROJECT_STATS_MESSAGE_NAME &&
          message?.data?.projectId === projectId.toString()
        ) {
          projectStats.value = constructProjectStats(message.data)
        }
      })
    }

    return {
      getCurrentChannel,
      openConnection,
      closeConnection,
      subscribeProjectStatsMessages,
      getProjectStats,
    }
  },
)
