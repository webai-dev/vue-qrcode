export type IInviteStatuses = "completed" | "pending"

const inviteStatusNames: { [key in IInviteStatuses]: string } = {
  completed: "active",
  pending: "pending",
}

export const inviteStatusPalette: {
  [key in IInviteStatuses as string]: string
} = {
  completed: "success",
  pending: "gray",
}

export const getInviteStatusName = (status: IInviteStatuses): string =>
  inviteStatusNames[status]
