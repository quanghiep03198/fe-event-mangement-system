import { Paths } from '@/common/constants/pathnames'
import { metadata } from '@/configs/metadata.config'
import { useAppSelector } from '@/redux/hook'
import React, { Suspense, useLayoutEffect } from 'react'
import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom'
import Loading from './loading'

const RootLayout: React.FunctionComponent = () => {
   const { pathname } = useLocation()
   const authenticated = useAppSelector((state) => state.auth.authenticated)
   const navigate = useNavigate()

   useLayoutEffect(() => {
      if (authenticated && ([Paths.SIGNIN, Paths.SIGNUP] as Array<string>).includes(pathname)) navigate(-1)
      const currentPath = Object.keys(metadata).find((path) => !!matchPath(path, pathname))
      document.title = metadata[currentPath as keyof typeof metadata] ?? 'Sự kiện Poly'
   }, [pathname])

   return (
      <Suspense fallback={<Loading />}>
         <Outlet />
      </Suspense>
   )
}

export default RootLayout
