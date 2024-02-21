import { metadata } from '@/configs/metadata.config'
import React, { Suspense, useEffect } from 'react'
import { Outlet, matchPath, useLocation } from 'react-router-dom'
import Loading from './loading'
import TawkMessenger from '@/components/ui/@tawk'

const RootLayout: React.FunctionComponent = () => {
   const { pathname } = useLocation()

   useEffect(() => {
      const currentPath = Object.keys(metadata).find((path) => Boolean(matchPath(path, pathname)))
      document.title = metadata[currentPath as keyof typeof metadata] ?? 'Sự kiện Poly'
   }, [pathname])

   return (
      <Suspense fallback={<Loading />}>
         <Outlet />
         <TawkMessenger />
      </Suspense>
   )
}

export default RootLayout
