import { UserInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import _ from 'lodash'
import axiosBaseQuery from '../helper'
import { UserRoleEnum } from '@/common/constants/enums'
import { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { UpdateUserSchema, UserSchema } from '@/schemas/user.schema'

type UserListWithPagination = Exclude<OptionalPagination<UserInterface>, Array<UserInterface>>
type RequestParams = Partial<PaginationPayload> & { role?: UserRoleEnum; pagination?: boolean } & AxiosRequestConfig['params']

const reducerPath = 'users/api' as const
const tagTypes = ['Users'] as const

export const userApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 15 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => ({
      getUsers: build.query<OptionalPagination<UserInterface>, RequestParams>({
         query: (params) => ({ url: '/participants', method: 'GET', params }),
         providesTags: tagTypes,
         transformResponse: (response: HttpResponse<OptionalPagination<UserInterface>>, _meta, args) => {
            // With pagination
            if (typeof args.pagination === 'undefined') {
               const data = response?.metadata as UserListWithPagination
               return {
                  ...data,
                  docs: data?.docs
               } as Pagination<UserInterface>
            }
            // Without pagination
            return response?.metadata as Array<UserInterface>
         }
      }),
      getUserInformation: build.query<UserInterface, number>({
         query: (id) => ({ url: `/participants/${id}`, method: 'GET' }),
         transformResponse: (response: HttpResponse<UserInterface>) => response.metadata,
         providesTags: (_response, _meta, arg) => [{ type: 'Users', id: arg }]
      }),
      addUser: build.mutation<HttpResponse<UserInterface>, z.infer<typeof UserSchema>>({
         query: (payload) => ({ url: '/participants', method: 'POST', data: payload }),
         invalidatesTags: (_response, error, _args) => (error ? [] : tagTypes)
      }),
      importUsersList: build.mutation<unknown, FormData>({
         query: (payload) => ({ url: '/importUser', method: 'POST', data: payload }),
         invalidatesTags: (_response, error, _args) => (error ? [] : tagTypes)
      }),
      updateUser: build.mutation<
         HttpResponse<UserInterface>,
         {
            id: Required<number>
            payload: z.infer<typeof UpdateUserSchema>
         }
      >({
         query: ({ id, payload }) => ({ url: `/participants/${id}`, method: 'PUT', data: payload }),
         invalidatesTags: (_response, error, _args) => (error ? [] : tagTypes)
      }),
      deleteUser: build.mutation<HttpResponse<undefined>, number>({
         query: (id) => ({ url: `/participants/${id}`, method: 'DELETE' }),
         invalidatesTags: (_response, error, _args) => (error ? [] : tagTypes)
      })
   })
})

export const { useGetUsersQuery, useGetUserInformationQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation, useImportUsersListMutation } =
   userApi
