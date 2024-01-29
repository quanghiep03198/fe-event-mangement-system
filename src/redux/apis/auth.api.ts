import { UserInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../helper'
import { z } from 'zod'
import { LoginSchema } from '@/schemas/auth.schema'

type SignupMetadata = Omit<UserInterface, 'password'>

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
   reducerPath,
   tagTypes,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => {
      return {
         login: build.mutation<
            HttpResponse<{
               user: Omit<UserInterface, 'password'>
               access_token: string
            }>,
            z.infer<typeof LoginSchema>
         >({
            query: (payload) => ({ url: '/login', method: 'POST', data: payload }),
            onQueryStarted: async (_, { queryFulfilled }) => {
               const { data } = await queryFulfilled
               const accessToken = data?.metadata?.access_token
               localStorage.setItem('access_token', `Bearer ${accessToken}`)
            }
         }),
         updateUserInfo: build.mutation<Partial<UserInterface>, Partial<UserInterface>>({
            query: (payload) => ({ url: '/updateUser', method: 'PATCH', data: payload }),
            transformResponse: (response: HttpResponse<Partial<UserInterface>>) => response.metadata!,
            invalidatesTags: tagTypes
         })
      }
   }
})

export const { useLoginMutation, useUpdateUserInfoMutation } = authApi
