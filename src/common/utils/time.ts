import Regex from '../constants/regex'

export type TimeObject = Record<'hours' | 'minutes' | 'seconds', number>

export const getCurrentDate = ({ hours, minutes, seconds }: TimeObject): Date => {
   if (!Regex.TIME.test([hours, minutes, seconds].join(':'))) throw new Error('Invalid time')
   const currentYear = new Date().getFullYear()
   const currentMonth = new Date().getMonth()
   const currentDay = new Date().getDate()
   return new Date(currentYear, currentMonth, currentDay, hours, minutes, seconds)
}

export const parseTime = (value: string): TimeObject => {
   if (!Regex.TIME.test(value)) throw new Error('Invalid time')
   const [hours, minutes, seconds] = value.split(':')
   return { hours: +hours, minutes: +minutes, seconds: +seconds }
}
