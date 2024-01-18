import { UserInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import _ from 'lodash'
import axiosBaseQuery from '../helper'
import { UserRoleEnum } from '@/common/constants/enums'
import { AxiosRequestConfig } from 'axios'

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
         transformResponse: (response: SuccessResponse<OptionalPagination<UserInterface>>, _meta, args) => {
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
      addUser: build.mutation<SuccessResponse<UserInterface>, Pick<UserInterface, 'name' | 'email' | 'phone' | 'role'>>({
         query: (payload) => ({ url: '/participants', method: 'POST', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      importUsersList: build.mutation<unknown, any>({
         query: (payload) => ({ url: '/importUser', method: 'POST', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      updateUser: build.mutation<
         SuccessResponse<UserInterface>,
         {
            id: Required<number>
            payload: Partial<UserInterface>
         }
      >({
         query: ({ id, payload }) => ({ url: `/participants/${id}`, method: 'PUT', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      deleteUser: build.mutation<SuccessResponse<undefined>, number>({
         query: (id) => ({ url: `/participants/${id}`, method: 'DELETE' }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      })
   })
})

export const { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation, useImportUsersListMutation } = userApi
