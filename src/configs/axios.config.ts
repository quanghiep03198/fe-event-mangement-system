import { signout } from '@/redux/slices/auth.slice'
import { store } from '@/redux/store'
import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const axiosInstance: AxiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL
})

axiosInstance.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const accessToken = window.localStorage.getItem('access_token')
      if (accessToken) config.headers.Authorization = accessToken
      return config
   },
   (error: AxiosError) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
   (response: AxiosResponse): AxiosResponse['data'] => response.data,
   (error: AxiosError) => {
      if (error.response?.status === HttpStatusCode.Unauthorized) {
         store.dispatch(signout())
         toast.info('Phiên đăng nhập đã hết hạn')
      }
      return Promise.reject(error)
   }
)

export default axiosInstance
