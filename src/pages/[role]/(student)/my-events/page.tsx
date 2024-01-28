/* eslint-disable */

import useQueryParams from '@/common/hooks/use-query-params'
import { EventInterface } from '@/common/types/entities'
import { Box, Icon, Typography } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { useGetEventsQuery, useGetJoinedEventsQuery, usePrefetch } from '@/redux/apis/event.api'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EmptySection } from '../components/shared/empty-section'

import Loading from './loading'
import FeedbackFormModal from './components/feedback-form-modal'
import { useAppSelector } from '@/redux/hook'
import EventCard from './components/event-card'

const MyEventsPage: React.FunctionComponent = () => {
   const [params] = useQueryParams('page', 'search', 'sort', 'rating', 'area')
   const [openFeedbackFormState, setOpenFeedbackFormState] = useState<boolean>(false)
   const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
   const user = useAppSelector((state) => state.auth.user)
   const { data, isLoading, refetch } = useGetJoinedEventsQuery({
      page: params.page ? Number(params.page) : 1,
      limit: 12,
      ...params
   })

   const prefetchNextPage = usePrefetch('getEvents')

   const handlePrefetchNextPage = useCallback(() => {
      if (data?.hasNextPage) prefetchNextPage({ page: +params.page + 1 })
   }, [prefetchNextPage, params])

   return (
      <>
         <Box className='flex flex-col gap-y-10 px-2 sm:p-4'>
            <Box className='flex w-full flex-1 flex-col items-stretch gap-y-4'>
               <Typography variant='h6' className='inline-flex items-center gap-x-2 text-primary'>
                  <Icon name='Newspaper' /> Sự kiện của tôi
               </Typography>
               {isLoading ? (
                  <Loading />
               ) : Array.isArray(data?.docs) && data?.docs.length === 0 ? (
                  <EmptySection />
               ) : (
                  <Box className='grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3'>
                     {data.docs.map((item) => (
                        <EventCard
                           key={item.id}
                           data={item}
                           onSelectEventToFeedback={(id) => {
                              setSelectedEventId(id)
                              setOpenFeedbackFormState(true)
                           }}
                        />
                     ))}
                  </Box>
               )}
            </Box>
            <Pagination {..._.omit(data, ['docs'])} onPrefetch={handlePrefetchNextPage} />
         </Box>

         <FeedbackFormModal
            open={openFeedbackFormState}
            onOpenChange={setOpenFeedbackFormState}
            onAfterFeedback={refetch}
            sender={user!}
            eventId={String(selectedEventId)}
         />
      </>
   )
}

export default MyEventsPage
