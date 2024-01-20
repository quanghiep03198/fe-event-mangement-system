import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { Box, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import React, { useState } from 'react'
import NotificationDetailsPanel from './components/notification-details-panel'
import NotificationHeader from './components/notification-list-header'
import NotificationListPanel from './components/notification-list-panel'
import NotificationMenu from './components/notification-menu'
import { NotificationProvider } from './context/notification-context'

const NotificationList: React.FunctionComponent = () => {
   const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
   const isSmallScreen = useMediaQuery('(min-width:320px) and (max-width: 1023px)')

   return (
      <NotificationProvider>
         <Box className='space-y-10'>
            <NotificationHeader />
            {/* Main panel */}
            <ResizablePanelGroup direction='horizontal' className='h-full flex-1 rounded-lg border'>
               <ResizablePanel defaultSize={4} minSize={4} maxSize={4} className='min-w-[4rem] p-3 sm:hidden'>
                  <NotificationMenu />
               </ResizablePanel>
               <ResizableHandle withHandle={!isSmallScreen} />
               <ResizablePanel
                  defaultSize={448}
                  minSize={36}
                  maxSize={64}
                  collapsible={true}
                  className={cn(isCollapsed && 'min-w-[24rem] transition-all duration-300 ease-in-out')}
                  onExpand={() => setIsCollapsed(false)}
                  onCollapse={() => setIsCollapsed(true)}
               >
                  <NotificationListPanel />
               </ResizablePanel>
               <ResizableHandle withHandle={!isSmallScreen} />
               <ResizablePanel defaultSize={320} collapsible={true} className='min-w-[16rem] sm:hidden md:hidden'>
                  <NotificationDetailsPanel />
               </ResizablePanel>
            </ResizablePanelGroup>
         </Box>
      </NotificationProvider>
   )
}

export default NotificationList
