import { EventStatusValues } from '@/common/constants/constants'
import { EventInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import { format } from 'date-fns'
import axiosBaseQuery from '../helper'

type RequestParams = {
   search?: string
   page?: number
   limit?: number
   pagination?: boolean
   sort?: string
}

const reducerPath = 'event/api' as const
const tagTypes = ['Event'] as const

export const eventApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 5 * 60,
   refetchOnReconnect: true,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => {
      return {
         getEvents: build.query<OptionalPagination<EventInterface>, RequestParams>({
            query: (params) => ({ url: '/event', method: 'GET', params }),
            transformResponse: (response: SuccessResponse<OptionalPagination<EventInterface>>, _meta, args) => {
               // With pagination
               if (typeof args.pagination === 'undefined') return response.metadata as Pagination<EventInterface>
               return Array.isArray(response.metadata)
                  ? response.metadata?.map((item) => {
                       return {
                          ...item,
                          status: EventStatusValues.get(item.status)
                       }
                    })
                  : []
            },
            providesTags: [{ type: 'Event', id: 'PARTIAL_LIST' }]
         }),
         getUpcomingEvents: build.query<EventInterface, void>({
            query: () => ({ url: '/event/notification', method: 'GET', params: { pagination: false } }),
            providesTags: [{ type: 'Event' as const, id: 'UPCOMING_LIST' }]
         }),
         getRecentEvents: build.query<EventInterface[], void>({
            query: () => ({ url: '/getNearstEvent', method: 'GET' }),
            transformResponse: (response: SuccessResponse<EventInterface[]>) => {
               if (!Array.isArray(response.metadata)) {
                  return [] as EventInterface[]
               }
               return response.metadata?.map((item) => ({
                  ...item,
                  start_time: format(item.start_time, 'dd/MM/yyyy'),
                  end_time: format(item.end_time, 'dd/MM/yyyy'),
                  status: EventStatusValues.get(item.status)
               }))
            },
            providesTags: [{ type: 'Event', id: 'RECENT_LIST' }]
         }),
         getJoinedEvents: build.query<Pagination<EventInterface>, RequestParams>({
            query: (params) => ({ url: '/eventJoin', method: 'GET', params }),
            transformResponse: (response: SuccessResponse<Pagination<EventInterface>>) => response.metadata,
            providesTags: [{ type: 'Event', id: 'JOINED_EVENTS_LIST' }]
         }),
         participateInEvent: build.mutation<unknown, { user_id: number; event_id: number }>({
            query: (payload) => ({ url: '/attendances', method: 'POST', data: payload }),
            invalidatesTags: tagTypes
         }),
         getEventDetails: build.query<EventInterface, string>({
            query: (id) => ({ url: `/event/${id}`, method: 'GET' }),
            transformResponse: (response: SuccessResponse<EventInterface>) => {
               return response.metadata!
            },
            providesTags: (result, _error, _arg) => (result ? [{ type: 'Event' as const, id: result?.id }] : tagTypes)
         }),
         createEvent: build.mutation({
            query: (payload) => ({ url: `/event`, method: 'POST', data: payload }),
            invalidatesTags: (_result, error, _arg) => (error ? [] : tagTypes)
         }),
         updateEvent: build.mutation({
            query: ({ id, payload }) => ({ url: `/event/${id}`, method: 'PATCH', data: payload }),
            invalidatesTags: (_result, error, _arg) => (error ? [] : tagTypes)
         }),
         deleteEvent: build.mutation({
            query: (id) => ({ url: `/event/${id}`, method: 'DELETE' }),
            invalidatesTags: (_result, error) => (error ? [] : tagTypes)
         })
      }
   }
})

export const {
   usePrefetch,
   useGetEventsQuery,
   useGetUpcomingEventsQuery,
   useCreateEventMutation,
   useUpdateEventMutation,
   useGetEventDetailsQuery,
   useDeleteEventMutation,
   useGetRecentEventsQuery,
   useGetJoinedEventsQuery,
   useParticipateInEventMutation
} = eventApi
