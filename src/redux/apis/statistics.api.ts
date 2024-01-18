import { StatisticsInterface } from '@/common/types/entities'
import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../helper'
import { AxiosRequestConfig } from 'axios'

const reducerPath = 'statistic/api' as const
const tagTypes = ['Statistics'] as const

export const statisticApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 15 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => ({
      getStatistics: build.query<StatisticsInterface, void>({
         query: () => ({ url: '/statistics', method: 'GET' }),
         transformResponse: (response: SuccessResponse<StatisticsInterface>) => {
            const data = response.metadata
            return {
               ...data!,
               percentInEvent: data?.percentInEvent?.toFixed(2),
               percentInFeedBack: data?.percentInFeedBack?.toFixed(2),
               percentInJoinEvent: data?.percentInJoinEvent?.toFixed(2)
            } as unknown as StatisticsInterface
         },
         providesTags: tagTypes
      }),
      getStudentStatistics: build.query<Array<{ name: string; total: number }>, AxiosRequestConfig['params']>({
         query: (params) => ({ url: '/eventStatisticsStudent', method: 'GET', params }),
         transformResponse: (response: SuccessResponse<Array<{ name: string; total: number }>>) => {
            return response.metadata as Array<{ name: string; total: number }>
         },
         providesTags: tagTypes
      })
   })
})

export const { useGetStatisticsQuery, useGetStudentStatisticsQuery } = statisticApi
