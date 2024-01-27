import { UserRoleEnum } from '@/common/constants/enums'
import Regex from '@/common/constants/regex'
import { z } from 'zod'

export const UserSchema = z.object({
   name: z.string({ required_error: 'Vui lòng nhập tên người dùng' }),
   email: z.string({ required_error: 'Vui lòng nhập email' }).regex(Regex.email, { message: 'Email phải có định dạng "xxx@gmail.com" hoặc "xxx@fpt.edu.vn"' }),
   phone: z.string({ required_error: 'Vui lòng nhập số điện thoại' }).regex(Regex.phone, { message: 'Số điện thoại không đúng dịnh dạng' }),
   role: z
      .number({ required_error: 'Vui lòng chọn vai trò tham gia' })
      .refine((value) => Object.values(UserRoleEnum).includes(value), { message: 'Vai trò không hợp lệ' })
})

export const AddUserSchema = z.object({
   email: z.string({ required_error: 'Vui lòng nhập email' }).email()
   // .regex(Regex.email, { message: 'Email phải có định dạng "xxx@gmail.com" hoặc "xxx@fpt.edu.vn"' })
})

export const UpdateUserSchema = z.object({
   name: z.string({ required_error: 'Vui lòng nhập tên người dùng' }),
   avatar: z.string().nullable().optional(),
   email: z.string({ required_error: 'Vui lòng nhập email' }).regex(Regex.email, { message: 'Email phải có định dạng "xxx@gmail.com" hoặc "xxx@fpt.edu.vn"' }),
   phone: z.string({ required_error: 'Vui lòng nhập số điện thoại' }).regex(Regex.phone, { message: 'Số điện thoại không đúng dịnh dạng' }),
   role: z
      .string({ required_error: 'Vui lòng chọn vai trò tham gia' })
      .or(z.number({ required_error: 'Vui lòng chọn vai trò tham gia' }))
      .nullable()
      .transform((value) => +value)
      .refine((value) => Object.values(UserRoleEnum).includes(value), { message: 'Vai trò không hợp lệ' })
      .optional()
})
