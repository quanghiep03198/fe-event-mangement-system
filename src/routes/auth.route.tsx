import { Paths } from '@/common/constants/pathnames'
import { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const LoginPage = lazy(() => import('@/pages/(auth)/login/page'))
const RegisterPage = lazy(() => import('@/pages/(auth)/register/page'))
const RecoverPasswordPage = lazy(() => import('@/pages/(auth)/recover-password/page'))

const authRoutes: Array<RouteObject> = [
   {
      path: Paths.LOGIN,
      element: <LoginPage />
   },
   {
      path: Paths.REGISTER,
      element: <RegisterPage />
   },
   {
      path: Paths.RECOVER_PASSOWRD,
      element: <RecoverPasswordPage />
   }
]

export default authRoutes
