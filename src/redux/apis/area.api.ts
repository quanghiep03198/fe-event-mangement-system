import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../helper'
import { AreaInterface } from '@/common/types/entities'
import { z } from 'zod'
import { AreaSchema } from '@/schemas/area.schema'

const reducerPath = 'area/api' as const
const tagTypes = ['Areas'] as const

export const areaApi = createApi({
   reducerPath,
   tagTypes,
   keepUnusedDataFor: 15 * 60,
   baseQuery: axiosBaseQuery(),
   endpoints: (build) => ({
      getAllAreas: build.query<AreaInterface[], { pagination?: boolean }>({
         query: (params) => ({ url: 'areas', method: 'GET', params }),
         transformResponse: (response: HttpResponse<AreaInterface[]>) => response.metadata,
         providesTags: tagTypes
      }),
      getArea: build.query<AreaInterface, string | number>({
         query: (id) => ({ url: `/areas/${id}`, method: 'GET' }),
         transformResponse: (response: HttpResponse<AreaInterface>) => response.metadata,
         providesTags: (result) => (result ? [{ type: 'Areas', id: result.id }] : tagTypes)
      }),
      createArea: build.mutation<unknown, z.infer<typeof AreaSchema>>({
         query: (payload) => ({ url: '/areas', method: 'POST', data: payload }),
         invalidatesTags: tagTypes
      }),
      updateArea: build.mutation<unknown, { id: number; payload: z.infer<ReturnType<typeof AreaSchema.partial>> }>({
         query: ({ id, payload }) => ({ url: `/areas/${id}`, method: 'PATCH', data: payload }),
         invalidatesTags: tagTypes
      }),
      deleteArea: build.mutation<unknown, number>({
         query: (id) => ({ url: `/areas/${id}`, method: 'DELETE' }),
         invalidatesTags: tagTypes
      })
   })
})

export const { useGetAllAreasQuery, useGetAreaQuery, useCreateAreaMutation, useUpdateAreaMutation, useDeleteAreaMutation } = areaApi
