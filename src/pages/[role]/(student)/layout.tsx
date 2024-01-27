import { Box } from '@/components/ui'
import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer'
import Header from './components/header'
import Loading from '@/pages/loading'
import Sidebar from './components/sidebar'
import DrawerSidebar from './components/sidebar/sidebar-sm'
import useQueryParams from '@/common/hooks/use-query-params'

const Layout: React.FunctionComponent = () => {
   const [open, setOpen] = useState<boolean>(false)
   const [params] = useQueryParams()
   const headerRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (headerRef.current) headerRef.current.scrollIntoView({ block: 'start' })
   }, [params])

   return (
      <Fragment>
         <Box className='flex h-screen flex-col items-stretch overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary'>
            <Box className='invisible m-0 h-0 w-0 p-0' ref={headerRef} />
            <Header open={open} onOpenChange={setOpen} />

            <Box className='mx-auto grid w-full max-w-full flex-1 grid-cols-[1fr_3.5fr] gap-x-10 py-10 sm:grid-cols-1 sm:px-2 md:grid-cols-1 md:px-2 lg:max-w-7xl lg:grid-cols-1 xl:max-w-7xl'>
               <Box className='sticky top-32 h-[calc(100vh-8em)] overflow-y-scroll overscroll-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary sm:hidden md:hidden lg:hidden'>
                  <Sidebar />
               </Box>
               <Suspense fallback={<Loading />}>
                  <Outlet />
               </Suspense>
            </Box>
            <Footer />
         </Box>
         <DrawerSidebar open={open} onOpenChange={setOpen} />
      </Fragment>
   )
}

export default Layout
