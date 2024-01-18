export enum UserRoleEnum {
   STUDENT = 0,
   STAFF = 1,
   MANAGER = 2
}

export enum Theme {
   LIGHT = 'light',
   DARK = 'dark',
   SYSTEM = 'system'
}

export enum EventStatus {
   UPCOMING = 2,
   ACTIVE = 1,
   INACTIVE = 0
}

export enum JoinEventStatus {
   NOT_YET = 0,
   ALREADY = 1
}

export enum NotificationSendingStatus {
   SCHEDULED = 0,
   SENT = 1
}

export enum BreakPoints {
   SMALL = '(min-width: 320px) and (max-width: 599px)',
   MEDIUM = '(min-width: 600px) and (max-width: 1023px)',
   LARGE = '(min-width: 1024px) and (max-width: 1365px)',
   EXTRA_LARGE = '(min-width: 1366px)',
   ULTIMATE_LARGE = '(min-width: 1920px)'
}
