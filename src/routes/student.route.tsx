import { Paths } from '@/common/constants/pathnames'
import { RouteObject } from 'react-router-dom'
import Layout from '@/pages/[role]/(student)/layout'
import { lazy } from 'react'
import AuthGuard from '@/guard/auth.guard'
import RoleGuard from '@/guard/role.guard'
import { UserRoleEnum } from '@/common/constants/enums'

const EventsList = lazy(() => import('@/pages/[role]/(student)/events/page'))
const EventDetails = lazy(() => import('@/pages/[role]/(student)/events/[id]/page'))
const MyEvents = lazy(() => import('@/pages/[role]/(student)/my-events/page'))

const studentRoutes: RouteObject = {
   path: Paths.HOME,
   element: (
      <AuthGuard>
         <RoleGuard roles={[UserRoleEnum.STUDENT]}>
            <Layout />
         </RoleGuard>
      </AuthGuard>
   ),
   children: [
      {
         path: Paths.EVENTS_BOARD,
         element: <EventsList />
      },
      {
         path: Paths.EVENTS_DETAILS,
         element: <EventDetails />
      },
      {
         path: Paths.MY_EVENTS,
         element: <MyEvents />
      }
   ]
}

export default studentRoutes
