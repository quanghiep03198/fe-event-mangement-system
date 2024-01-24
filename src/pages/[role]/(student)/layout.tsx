import { Box } from '@/components/ui'
import React, { Fragment, Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer'
import Header from './components/header'
import Loading from '@/pages/loading'
import Sidebar from './components/sidebar'
import DrawerSidebar from './components/sidebar/sidebar-sm'

const Layout: React.FunctionComponent = () => {
   const [open, setOpen] = useState<boolean>(false)

   return (
      <Fragment>
         <Box
            className='flex h-screen flex-col items-stretch overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary'
            as='main'
         >
            <Header open={open} onOpenChange={setOpen} />

            <Box className='mx-auto grid max-w-7xl flex-1 grid-cols-[1fr_4fr] gap-x-12 py-10 sm:grid-cols-1 sm:px-2 md:grid-cols-1 md:px-2 lg:grid-cols-[1fr_3.5fr]'>
               <Box className='h-[calc(100vh-8em)] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary sm:hidden md:hidden'>
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
