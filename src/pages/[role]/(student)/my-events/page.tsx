/* eslint-disable */

import useQueryParams from '@/common/hooks/use-query-params'
import { EventInterface } from '@/common/types/entities'
import { Box, Icon, Typography } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { useGetEventsQuery, useGetJoinedEventsQuery, usePrefetch } from '@/redux/apis/event.api'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { EmptySection } from '../components/shared/empty-section'
import { EventHorizontalCard } from '../components/shared/event-card'
import Loading from './loading'

const MyEventsPage: React.FunctionComponent = () => {
   const [searchValue] = useState<string>('')
   const [sortValue] = useState<string>('')
   const [params] = useQueryParams('page')
   const currentPage = useMemo(() => (params.page ? Number(params.page) : 1), [params])
   const { data, isLoading } = useGetJoinedEventsQuery({
      page: currentPage,
      limit: 12,
      search: searchValue,
      sort: sortValue
   })
   const prefetchNextPage = usePrefetch('getEvents')
   const eventsList = useMemo(() => data as Pagination<EventInterface>, [data])

   const handlePrefetchNextPage = useCallback(() => {
      if (eventsList.hasNextPage) prefetchNextPage({ page: currentPage + 1 })
   }, [prefetchNextPage, params])

   return (
      <Box className='mx-auto max-w-7xl space-y-10 py-20 sm:px-4 md:px-4'>
         <Box className='space-y-4'>
            <Typography variant='h6' className='inline-flex items-center gap-x-2 text-primary'>
               <Icon name='Newspaper' /> Sự kiện của tôi
            </Typography>
            {isLoading ? (
               <Loading />
            ) : Array.isArray(eventsList?.docs) && eventsList?.docs.length === 0 ? (
               <EmptySection />
            ) : (
               <Box className='grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-1 md:grid-cols-1'>
                  {eventsList.docs.map((item) => (
                     <EventHorizontalCard key={item.id} data={item} />
                  ))}
               </Box>
            )}
         </Box>

         <Pagination {..._.omit(eventsList, ['docs'])} onPrefetch={handlePrefetchNextPage} />
      </Box>
   )
}

export default MyEventsPage
