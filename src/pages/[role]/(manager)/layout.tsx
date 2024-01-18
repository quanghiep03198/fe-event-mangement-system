import { BreakPoints, UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import ErrorBoundary from '@/components/shared/error-boundary'
import Fallback from '@/pages/fallback'
import { Box, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'
import NavHeader from './components/nav-header'
import DrawerNavSidebar from './components/nav-sidebar/drawer-nav-sidebar'
import StaticNavSidebar from './components/nav-sidebar/static-nav-sidebar'

const navigation: Array<MenuNavigationItem> = [
   {
      id: 1,
      icon: 'LayoutDashboard',
      name: 'Màn hình chính',
      path: Paths.MANAGER_DASHBOARD,
      roles: [UserRoleEnum.MANAGER]
   },
   {
      id: 2,
      icon: 'CalendarCheck2',
      name: 'Sự kiện',
      path: Paths.EVENTS_LIST,
      roles: [UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
   },
   {
      id: 3,
      icon: 'Users',
      name: 'Cộng tác viên',
      path: Paths.STAFFS_LIST,
      roles: [UserRoleEnum.MANAGER]
   },
   {
      id: 4,
      icon: 'UsersRound',
      name: 'Sinh viên',
      path: Paths.STUDENTS_LIST,
      roles: [UserRoleEnum.MANAGER]
   },
   {
      id: 5,
      icon: 'BellRing',
      name: 'Thông báo',
      path: Paths.NOTIFICATION_LIST,
      roles: [UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
   }
]

const Layout: React.FunctionComponent = () => {
   const [open, setOpen] = useState<boolean>(false)
   const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
   const isLargeScreen = useMediaQuery(BreakPoints.LARGE)
   const isExtraLargeScreen = useMediaQuery(BreakPoints.EXTRA_LARGE)

   return (
      <>
         <ResizablePanelGroup direction='horizontal' className='h-screen w-screen'>
            <ResizablePanel
               defaultSize={20}
               minSize={4}
               collapsedSize={4}
               maxSize={20}
               collapsible={true}
               className={cn('sm:hidden md:hidden', isCollapsed && 'z-50 min-w-[4rem] transition-all duration-300 ease-in-out')}
               onExpand={() => setIsCollapsed(false)}
               onCollapse={() => setIsCollapsed(true)}
            >
               <StaticNavSidebar navigation={navigation} isCollapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle={isLargeScreen || isExtraLargeScreen} />
            <ResizablePanel>
               <Box className='h-screen max-w-full overflow-y-scroll bg-background scrollbar-thin scrollbar-thumb-border'>
                  <NavHeader openState={open} onOpenStateChange={setOpen} />
                  <Box as='section' className='p-10 sm:p-3'>
                     <ErrorBoundary>
                        <Suspense fallback={<Fallback />}>
                           <Outlet />
                        </Suspense>
                     </ErrorBoundary>
                  </Box>
               </Box>
            </ResizablePanel>
         </ResizablePanelGroup>
         <DrawerNavSidebar open={open} onOpenStateChange={setOpen} navigation={navigation} />
      </>
   )
}

export default Layout
