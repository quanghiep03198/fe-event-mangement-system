import { metadata } from '@/configs/metadata.config'
import Regex from '@/common/constants/regex'
import axiosInstance from '@/configs/axios.config'
import { debounce, pick } from 'lodash'
import * as z from 'zod'
import { useEffect, useState } from 'react'

export const LoginSchema = z.object({
   email: z.string({ required_error: 'Vui lòng nhập email' }).email('Email không đúng định dạng'),
   password: z.string({ required_error: 'Vui lòng nhập mật khẩu' })
})

export const RegisterSchema = z
   .object({
      name: z.string({ required_error: 'Vui lòng nhập tên của bạn' }),
      email: z
         .string({ required_error: 'Vui lòng nhập email' })
         .email('Email không đúng định dạng')
         .regex(Regex.email, { message: 'Email phải có định dạng xxx@gmail.com / xxx@fpt.edu.vn' }),
      password: z.string({ required_error: 'Vui lòng nhập mật khẩu' }).min(6, 'Mật khẩu phải có tối thiểu 6 ký tự'),
      confirmPassword: z.string({ required_error: 'Vui lòng nhập mật khẩu xác thực' }),
      phone: z.string({ required_error: 'Vui lòng nhập số điện thoại' }).regex(Regex.phone, { message: 'Số điện thoại không hợp lệ' })
   })
   .refine(
      (values) => {
         return values.password === values.confirmPassword
      },
      {
         message: 'Mật khẩu xác thực chưa đúng',
         path: ['confirmPassword']
      }
   )

export const ChangePasswordSchema = z
   .object({
      currentPassword: z.string({ required_error: 'Vui lòng nhập mật khẩu hiện tại' }),

      password: z
         .string({ required_error: 'Vui lòng nhập mật khẩu' })
         .min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' })
         .regex(Regex.password, { message: 'Mật khẩu mới phải có ít nhất 1 chữ số và 1 ký tự in hoa' }),
      confirmPassword: z.string({ required_error: 'Vui lòng nhập mật khẩu xác thực' })
   })
   .refine(
      (values) => {
         return values.password === values.confirmPassword
      },
      {
         message: 'Mật khẩu xác thực chưa đúng',
         path: ['confirmPassword']
      }
   )

export const recoverPasswordSchema = z.object({
   email: z
      .string({ required_error: 'Vui lòng nhập email' })
      .email({ message: 'Email không đúng định dạng' })
      .regex(Regex.email, { message: 'Email không đúng định dạng' })
})

export const resetPasswordSchema = z
   .object({
      token: z.string({ required_error: 'Vui lòng nhập mã xác thực' }),
      password: z
         .string({ required_error: 'Vui lòng nhập mật khẩu mới' })
         .regex(Regex.password, { message: 'Mật khẩu mới phải có ít nhất 1 ký tự viết hoa, và 1 chữ số' }),
      confirmPassword: z.string({ required_error: 'Vui lòng nhập mật khẩu xác thực' })
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword']
   })
