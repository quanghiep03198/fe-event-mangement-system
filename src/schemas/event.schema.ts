import Regex from '@/common/constants/regex'
import { compareAsc, format, parse } from 'date-fns'
import * as z from 'zod'

const BaseEventSchema = z.object({
   name: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }),
   location: z.string({ required_error: 'Vui lòng nhập địa điệm tổ chức' }),
   area: z.string({ required_error: 'Vui chọn khu vực tổ chức' }),
   contact: z
      .string({ required_error: 'Vui lòng nhập số điện thoại liên hệ' })
      .min(1, { message: 'Vui lòng nhập số điện thoại liên hệ' })
      .regex(Regex.phone, { message: 'Số điện thoại không đúng định dạng' }),
   user_id: z.string({ required_error: 'Vui lòng chọn người tổ chức' }).or(z.number({ required_error: 'Vui lòng chọn người tổ chức' })),
   content: z.string({ required_error: 'Vui lòng nhập nội dung' }),
   description: z.string({ required_error: 'Vui lòng nhập mô tả' }),
   banner: z.any({ required_error: 'Vui lòng tải lên ảnh' }),
   start_time: z.date({ required_error: 'Vui lòng chọn ngày bắt đầu' }),
   end_time: z.date({ required_error: 'Vui lòng chọn ngày kết thúc' })
})

export const CreateEventSchema = z
   .object({
      ...BaseEventSchema.shape,
      start_time: z.date({ required_error: 'Vui lòng chọn ngày bắt đầu' }).transform((value) => format(value, 'yyyy/MM/dd HH:mm:ss')),
      end_time: z.date({ required_error: 'Vui lòng chọn ngày bắt đầu' }).transform((value) => format(value, 'yyyy/MM/dd HH:mm:ss')),
      banner: z.instanceof(FileList, { message: 'Vui lòng chọn ảnh bìa' })
   })
   .refine(
      (values) => {
         return compareAsc(new Date(values.start_time), new Date(values.end_time)) === -1
      },
      {
         message: 'Ngày kết thúc phải lơn hơn ngày bắt đầu',
         path: ['end_time']
      }
   )

export const UpdateEventSchema = z
   .object({
      ...BaseEventSchema.shape,
      banner: z.instanceof(FileList).optional()
   })
   .refine(
      (values) => {
         return compareAsc(new Date(values.start_time), new Date(values.end_time)) === -1
      },
      {
         message: 'Ngày kết thúc phải lơn hơn ngày bắt đầu',
         path: ['end_time']
      }
   )
