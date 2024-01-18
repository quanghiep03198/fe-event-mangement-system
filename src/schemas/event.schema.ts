import Regex from '@/common/constants/regex'
import { compareAsc, format, parse } from 'date-fns'
import * as z from 'zod'

const BaseEventSchema = z.object({
   name: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }).min(1, { message: 'Vui lòng nhập tên sự kiện' }),
   location: z.string({ required_error: 'Vui lòng nhập địa điệm tổ chức' }).min(1, { message: 'Vui lòng nhập địa điệm tổ chức' }),
   contact: z
      .string({ required_error: 'Vui lòng nhập số điện thoại liên hệ' })
      .min(1, { message: 'Vui lòng nhập số điện thoại liên hệ' })
      .regex(Regex.phone, { message: 'Số điện thoại không đúng định dạng' }),
   content: z.string({ required_error: 'Vui lòng nhập nội dung' }),
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

console.log(parse(format(new Date(), 'yyyy/MM/dd HH:mm:ss'), 'yyyy/MM/dd HH:mm:ss', new Date()))
