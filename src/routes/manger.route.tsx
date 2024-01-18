import { UserRoleEnum } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import AuthGuard from '@/guard/auth.guard'
import RoleGuard from '@/guard/role.guard'
import { lazy } from 'react'
import Layout from '@/pages/[role]/(manager)/layout'
import { RouteObject } from 'react-router-dom'

/**
 * @description router for both manager & staff but pages are restricted by user's role
 */

const DashboardPage = lazy(() => import('@/pages/[role]/(manager)/dashboard/page'))
const EventListPage = lazy(() => import('@/pages/[role]/(manager)/events/page'))
const CreateEventPage = lazy(() => import('@/pages/[role]/(manager)/events/create/page'))
const UpdateEventPage = lazy(() => import('@/pages/[role]/(manager)/events/edit/page'))
const StaffListPage = lazy(() => import('@/pages/[role]/(manager)/staffs/page'))
const StudentsListPage = lazy(() => import('@/pages/[role]/(manager)/students/page'))
const NotificationListPage = lazy(() => import('@/pages/[role]/(manager)/notification/page'))
const CreateNotification = lazy(() => import('@/pages/[role]/(manager)/notification/create/page'))
const EditNotificationPage = lazy(() => import('@/pages/[role]/(manager)/notification/edit/page'))
const EventDetailsPage = lazy(() => import('@/pages/[role]/(manager)/events/[id]/page'))

const managerRoutes: RouteObject = {
   path: Paths.MANAGER,
   element: (
      <AuthGuard>
         <Layout />
      </AuthGuard>
   ),
   children: [
      {
         path: Paths.MANAGER_DASHBOARD,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <DashboardPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.EVENTS_LIST,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <EventListPage />
            </RoleGuard>
         )
      },

      {
         path: Paths.CREATE_EVENT,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <CreateEventPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.EVENT_STATISTICS_DETAILS,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <EventDetailsPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.EDIT_EVENT,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <UpdateEventPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.STAFFS_LIST,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER]}>
               <StaffListPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.STUDENTS_LIST,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <StudentsListPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.NOTIFICATION_LIST,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <NotificationListPage />
            </RoleGuard>
         )
      },
      {
         path: Paths.CREATE_NOTIFICATION,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <CreateNotification />
            </RoleGuard>
         )
      },
      {
         path: Paths.EDIT_NOTIFICATION,
         element: (
            <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.STAFF]}>
               <EditNotificationPage />
            </RoleGuard>
         )
      }
   ]
}

export default managerRoutes
