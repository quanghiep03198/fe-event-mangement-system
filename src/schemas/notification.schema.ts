import { addMinutes, format, isAfter, isBefore } from 'date-fns'
import { z } from 'zod'

export const NotificationSchema = z.object({
   title: z.string({ required_error: 'Vui lòng nhập tiêu đề' }),
   event_id: z
      .string({ required_error: 'Vui lòng chọn sự kiện' })
      .or(z.number({ required_error: 'Vui lòng chọn sự kiện' }))
      .transform((value) => +value),
   time_send: z.string().default(format(new Date(), 'yyyy-MM-dd HH:mm:ss')),
   status: z.number().default(1),
   content: z.string()
})

export const TimeSendSchema = (context) =>
   z
      .object({
         date: z.date({ required_error: 'Vui lòng chọn ngày' }).transform((value) => format(value, 'yyyy-MM-dd')),
         time: z.string()
      })
      .refine(
         (data) => {
            return isAfter(new Date(data.date + ' ' + data.time), new Date())
         },
         {
            message: 'Thời gian không hợp lệ',
            path: ['time']
         }
      )
      .refine((data) => isBefore(new Date(data.date + ' ' + data.time), new Date(context.maxValue)), {
         message: 'Thời gian gửi phải trong thời gian diễn ra sự kiện',
         path: ['time']
      })
      .refine((data) => isAfter(new Date(data.date + ' ' + data.time), addMinutes(new Date(), 5)), {
         message: 'Thời gian lên lịch tối thiểu từ 5 phút',
         path: ['time']
      })

export const FilterNotificationSchema = z.object({
   type: z.string().optional(),
   sender: z.number().optional(),
   event: z.number().optional(),
   from_date: z
      .date()
      .transform((value) => format(value, 'yyyy-MM-dd HH:mm:ss'))
      .optional(),
   to_date: z
      .date()
      .transform((value) => format(value, 'yyyy-MM-dd HH:mm:ss'))
      .optional()
})
