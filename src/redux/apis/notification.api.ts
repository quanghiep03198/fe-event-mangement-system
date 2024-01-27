import { NotificationInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig } from 'axios'
import axiosBaseQuery from '../helper'
import { z } from 'zod'
import { NotificationSchema } from '@/schemas/notification.schema'

const reducerPath = 'notifiction/api' as const
const tagTypes = ['Notification'] as const

export const notificationApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 15 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => ({
      getAllNotificationToUser: build.query<Pagination<NotificationInterface>, { userId: number; params: AxiosRequestConfig['params'] }>({
         query: ({ userId, params }) => ({ url: `/notification/settings/${userId}`, method: 'GET', params: { ...params, page: params.page ?? 1 } }),
         transformResponse: (response: HttpResponse<Pagination<NotificationInterface>>, _meta, args): Pagination<NotificationInterface> => {
            if (args.params.type === 'all')
               return {
                  ...response.metadata,
                  docs: response.metadata?.docs ? response.metadata.docs.filter((item) => !item.deleted_at) : []
               } as Pagination<NotificationInterface>
            return response.metadata!
         },
         providesTags: tagTypes
      }),
      getNotificationDetails: build.query<NotificationInterface, string>({
         query: (id) => ({ url: `/notification/show/${id}`, method: 'GET' }),
         transformResponse: (response: HttpResponse<NotificationInterface>): NotificationInterface => response.metadata!,
         providesTags: (response) => [{ id: response?.id, type: 'Notification' }, ...tagTypes]
      }),
      createNotification: build.mutation<unknown, z.infer<typeof NotificationSchema>>({
         query: (payload) => ({ url: '/notification', method: 'POST', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      editNotification: build.mutation<unknown, { id: string; payload: z.infer<ReturnType<typeof NotificationSchema.partial>> }>({
         query: ({ id, payload }) => ({ url: `/notification/${id}`, method: 'PATCH', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      deleteNotification: build.mutation<unknown, { id: number; params?: { softDel: boolean } }>({
         query: ({ id, params }) => ({ url: `/notification/${id}`, method: 'DELETE', params }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      })
   })
})

export const {
   usePrefetch,
   useGetAllNotificationToUserQuery,
   useGetNotificationDetailsQuery,
   useCreateNotificationMutation,
   useEditNotificationMutation,
   useDeleteNotificationMutation
} = notificationApi
