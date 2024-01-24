import { Paths } from '@/common/constants/pathnames'

export const metadata = {
   [Paths.EVENTS_DETAILS + '/:id']: 'Sự kiện',
   /* AUTH */
   [Paths.LOGIN]: 'Đăng nhập',
   [Paths.REGISTER]: 'Đăng ký tài khoản',

   /* ERROR */
   [Paths.NOT_FOUND]: '404 - Page not found',
   [Paths.PERMISSION_DENIED]: '403 - Access denied',

   /* MANAGER */
   [Paths.MANAGER_DASHBOARD]: 'Màn hình chính',
   [Paths.EVENTS_LIST]: 'Sự kiện',
   [Paths.CREATE_EVENT]: 'Thêm sự kiện',
   [Paths.EDIT_EVENT]: 'Cập nhật sự kiện',
   [Paths.STAFFS_LIST]: 'Cộng tác viên',
   [Paths.STUDENTS_LIST]: 'Sinh viên',
   [Paths.NOTIFICATION_LIST]: 'Thông báo',
   [Paths.CREATE_NOTIFICATION]: 'Tạo thông báo',

   /* NAVIGATION */
   [Paths.REDIRECT]: 'Đang chuyển hướng ...',

   /* STUDENT */
   [Paths.EVENTS_BOARD]: 'Sự kiện',
   [Paths.MY_EVENTS]: 'Sự kiện của tôi'
} as const
