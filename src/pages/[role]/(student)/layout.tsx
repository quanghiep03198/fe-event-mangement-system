import { Box } from '@/components/ui'
import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/footer'
import Header from './components/header'
import Loading from '@/pages/loading'

const Layout: React.FunctionComponent = () => {
   return (
      <Box
         className='flex min-h-screen flex-col items-stretch overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/25'
         as='main'
      >
         <Header />
         <Box className='h-full min-h-[calc(100vh-240px)] flex-1'>
            <Suspense fallback={<Loading />}>
               <Outlet />
            </Suspense>
         </Box>
         <Footer />
      </Box>
   )
}

export default Layout
