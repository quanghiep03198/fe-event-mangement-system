import { UserInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig } from 'axios'
import axiosBaseQuery from '../helper'
import { eventApi } from './event.api'
import { UserRoleValues } from '@/common/constants/constants'

const tagTypes = ['Attendance', 'Event'] as const
const reducerPath: string = 'attendance/api' as const

export type Atteendees = {
   id: number
   event_id: number
   user: Partial<UserInterface>
   created_at: Date
   updated_at: Date
}

export const attendanceApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 5 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => {
      return {
         getAttendeesByEvent: build.query<Atteendees[], { eventId: string; params?: AxiosRequestConfig['params'] }>({
            query: ({ eventId, params }) => ({ url: `/attendances/join/${eventId}`, method: 'GET', params }),
            transformResponse: (response: HttpResponse<Atteendees[]>, _meta, _args) =>
               response.metadata?.map((item) => ({ ...item, user: { ...item.user, role: UserRoleValues.get(item.user.role!) } })) as any[],
            providesTags: (result, _error, _arg) => {
               return Array.isArray(result) ? [...result?.map(({ id }) => ({ type: 'Attendance' as const, id })), ...tagTypes] : tagTypes
            }
         }),
         addAttendance: build.mutation<unknown, { email: string; event_id: string | number }>({
            query: (payload) => ({ url: '/attendances/add', method: 'POST', data: payload }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
               await queryFulfilled
               dispatch(eventApi.endpoints.getEventDetails.initiate(args.event_id as string))
            },
            invalidatesTags: (_result, error, args) => (error ? [] : [{ type: 'Event', id: args.event_id }, ...tagTypes])
         }),
         getAttendeeInfo: build.query({
            query: (id) => ({ url: `/attendances/${id}`, method: 'GET' }),
            providesTags: tagTypes
         }),
         moveAttendeeToEvent: build.mutation<unknown, { id: string | number; payload: { event_id: number; user_id: number } }>({
            query: ({ id, payload }) => ({ url: `/attendances/${id}`, method: 'PATCH', data: payload }),
            invalidatesTags: tagTypes
         }),
         removeAttendanceFromEvent: build.mutation<unknown, number>({
            query: (id) => ({ url: `/attendances/${id}`, method: 'DELETE' }),
            invalidatesTags: tagTypes
         })
      }
   }
})

export const {
   useAddAttendanceMutation,
   useGetAttendeeInfoQuery,
   useGetAttendeesByEventQuery,
   useRemoveAttendanceFromEventMutation,
   useMoveAttendeeToEventMutation
} = attendanceApi
