import { UserInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../helper'

type SigninMetadata = { user: Omit<UserInterface, 'password'>; access_token: string }
type SigninPayload = Pick<UserInterface, 'email' | 'password'>
type SignupPayload = Pick<UserInterface, 'email' | 'name' | 'phone' | 'password'>
type SignupMetadata = Omit<UserInterface, 'password'>

const reducerPath = 'auth/api' as const
const tagTypes = ['Auth'] as const

export const authApi = createApi({
   reducerPath,
   tagTypes,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => {
      return {
         signin: build.mutation<HttpResponse<SigninMetadata>, SigninPayload>({
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
         }),
         signup: build.mutation<HttpResponse<SignupMetadata>, SignupPayload>({
            query: (payload) => ({ url: '/register', method: 'POST', data: payload })
         })
      }
   }
})

export const { useSigninMutation, useSignupMutation, useUpdateUserInfoMutation } = authApi
