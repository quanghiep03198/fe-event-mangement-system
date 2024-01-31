import { useCallback, useMemo } from 'react'
import _ from 'lodash'
import useQueryParams from '@/common/hooks/use-query-params'
import { EventInterface } from '@/common/types/entities'
import { Box, Icon, Typography } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { useGetEventsQuery, usePrefetch } from '@/redux/apis/event.api'
import { EmptySection } from '../components/shared/empty-section'
import EventCard from './components/event-card'
import Loading from './loading'

const EventsBoardPage: React.FunctionComponent = () => {
   const [params] = useQueryParams('page', 'search', 'area', 'status', 'sort', 'rating')
   const currentPage = useMemo(() => (params.page ? Number(params.page) : 1), [params])

   const { data, isLoading } = useGetEventsQuery({
      page: currentPage,
      limit: 12,
      ...params
   })

   const eventsList = useMemo(() => data as Pagination<EventInterface>, [data])
   const prefetchNextPage = usePrefetch('getEvents')

   const handlePrefetchNextPage = useCallback(() => {
      if (eventsList.hasNextPage) prefetchNextPage({ page: currentPage + 1 })
   }, [prefetchNextPage, params])

   return (
      <Box className='flex flex-col gap-y-10 px-2 sm:p-4'>
         <Box className='flex w-full flex-1 flex-col items-stretch gap-y-4'>
            <Typography variant='h6' className='inline-flex items-center gap-x-2 text-primary'>
               <Icon name='Newspaper' /> Tin tức sự kiện
            </Typography>
            {isLoading ? (
               <Loading />
            ) : Array.isArray(eventsList?.docs) && eventsList?.docs?.length === 0 ? (
               <EmptySection />
            ) : (
               <Box className='grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-1 md:md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:gap-x-6'>
                  {Array.isArray(eventsList?.docs) && eventsList?.docs?.map((item) => <EventCard key={item.id} data={item} />)}
               </Box>
            )}
         </Box>
         <Pagination {..._.omit(eventsList, ['docs'])} onPrefetch={handlePrefetchNextPage} />
      </Box>
   )
}

export default EventsBoardPage
