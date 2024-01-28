import { createApi } from '@reduxjs/toolkit/dist/query/react'
import axiosBaseQuery from '../helper'
import { FeedbackInterface } from '@/common/types/entities'
import { AxiosRequestConfig } from 'axios'
import { eventApi } from './event.api'
import { z } from 'zod'
import { FeedbackSchema } from '@/schemas/feedback.schema'

const reducerPath = 'feedbacks/api' as const
const tagTypes = ['Feedback', 'Event'] as const

export const feedbackApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 15 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => ({
      getAllFeedbackByEvent: build.query<Pagination<FeedbackInterface>, { eventId: string; params?: AxiosRequestConfig['params'] }>({
         query: ({ eventId, params }) => ({ url: `/feedback/${eventId}`, method: 'GET', params }),
         transformResponse: (response: HttpResponse<Pagination<FeedbackInterface>>) => response.metadata,
         providesTags: tagTypes
      }),
      getFeedbackDetails: build.query<FeedbackInterface, string | number>({
         query: (id) => ({ url: `/feedback/show/${id}`, method: 'GET' }),
         transformResponse: (response: HttpResponse<FeedbackInterface>) => response.metadata,
         providesTags: (result, _error, _arg) => (result ? [{ type: 'Feedback' as const, id: result?.id }, ...tagTypes] : tagTypes)
      }),
      createFeedback: build.mutation<unknown, z.infer<typeof FeedbackSchema> & { event_id: string }>({
         query: (payload) => ({ url: '/feedback', method: 'POST', data: payload }),
         onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
            await queryFulfilled
            dispatch(eventApi.endpoints.getJoinedEvents.initiate({}))
         },
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      updateFeedback: build.mutation<unknown, { id: number; payload: Partial<FeedbackInterface> }>({
         query: ({ id, payload }) => ({ url: `/feedback/${id}`, method: 'PATCH', data: payload }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      }),
      deleteFeedback: build.mutation<unknown, number>({
         query: (id) => ({ url: `/feedback/${id}`, method: 'DELETE' }),
         invalidatesTags: (_result, error, _args) => (error ? [] : tagTypes)
      })
   })
})

export const {
   usePrefetch,
   useGetAllFeedbackByEventQuery,
   useGetFeedbackDetailsQuery,
   useCreateFeedbackMutation,
   useUpdateFeedbackMutation,
   useDeleteFeedbackMutation
} = feedbackApi
