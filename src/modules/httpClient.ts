import axios from "axios"
const proxyRemoteApi = !!import.meta.env.VITE_PROXY_REMOTE_API

// const proxyRemoteApi = true

const API_CONFIG = {
  baseURL: proxyRemoteApi ? "/api" : `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
}

const httpClient = axios.create(API_CONFIG)

// Add a request interceptor
httpClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
httpClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error) {
    const router = useRouter()
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401 && !!router) {
      await router.push({ name: "auth.login" })
    }

    return Promise.reject(error)
  },
)

export default httpClient
