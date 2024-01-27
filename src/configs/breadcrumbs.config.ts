import { Paths } from '@/common/constants/pathnames'

export const breadcrumbs = {
   /* MANAGER */
   [Paths.MANAGER_DASHBOARD]: [{ path: Paths.MANAGER_DASHBOARD, name: 'Màn hình chính' }],
   [Paths.EVENTS_LIST]: [{ path: Paths.EVENTS_LIST, name: 'Sự kiện' }],
   [Paths.CREATE_EVENT]: [
      { path: Paths.EVENTS_LIST, name: 'Sự kiện' },
      { path: Paths.CREATE_EVENT, name: 'Thêm mới' }
   ],
   [Paths.EDIT_EVENT]: [
      { path: Paths.EVENTS_LIST, name: 'Sự kiện' },
      { path: Paths.EDIT_EVENT, name: 'Cập nhật' }
   ],
   [Paths.EVENT_STATISTICS_DETAILS]: [
      { path: Paths.EVENTS_LIST, name: 'Sự kiện' },
      { path: Paths.EVENT_STATISTICS_DETAILS, name: 'Thống kê chi tiết' }
   ],
   [Paths.STAFFS_LIST]: [{ path: Paths.STAFFS_LIST, name: 'Công tác viên' }],
   [Paths.STUDENTS_LIST]: [{ path: Paths.STUDENTS_LIST, name: 'Sinh viên' }],
   [Paths.NOTIFICATION_LIST]: [{ path: Paths.NOTIFICATION_LIST, name: 'Thông báo' }],
   [Paths.CREATE_NOTIFICATION]: [
      { path: Paths.NOTIFICATION_LIST, name: 'Thông báo' },
      { path: Paths.CREATE_NOTIFICATION, name: 'Tạo thông báo' }
   ],
   [Paths.EDIT_NOTIFICATION]: [
      { path: Paths.NOTIFICATION_LIST, name: 'Thông báo' },
      { path: Paths.EDIT_NOTIFICATION, name: 'Cập nhật' }
   ],
   [Paths.ACCOUNT_SETTINGS]: [
      { path: Paths.ACCOUNT_SETTINGS, name: 'Cài đặt' },
      { path: Paths.ACCOUNT_SETTINGS, name: 'Tài khoản' }
   ],
   [Paths.AREAS_LIST]: [{ path: Paths.AREAS_LIST, name: 'Cơ sở' }]
}
