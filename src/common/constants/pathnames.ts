export const Paths = {
   HOME: '/',
   /** Auth middleware route */
   REDIRECT: '/',

   /** Auth routes */
   SIGNIN: '/signin',
   SIGNUP: '/signup',
   RECOVER_PASSOWRD: '/forgot-password',

   /** User preferences routes */
   ACCOUNT_SETTINGS: '/account-settings',

   /** Error routes */
   NOT_FOUND: '/404',
   PERMISSION_DENIED: '/403',

   /** Manager routes */
   MANAGER: '/manager',
   MANAGER_DASHBOARD: '/manager/dashboard',
   EVENTS_LIST: '/manager/events',
   CREATE_EVENT: '/manager/events/create',
   EDIT_EVENT: '/manager/events/:id/edit',
   EVENT_STATISTICS_DETAILS: '/manager/events/:id',
   STAFFS_LIST: '/manager/participants',
   STUDENTS_LIST: '/manager/student-list',
   NOTIFICATION_LIST: '/manager/notification',
   CREATE_NOTIFICATION: '/manager/notification/create',
   EDIT_NOTIFICATION: '/manager/notification/:id/edit',

   /** Student routes */
   EVENTS_BOARD: '/student/events',
   EVENTS_DETAILS: '/student/events/:id',
   MY_EVENTS: '/student/my-events'
} as const
