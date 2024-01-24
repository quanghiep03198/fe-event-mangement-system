/* eslint-disable */

import useQueryParams from '@/common/hooks/use-query-params'
import { EventInterface } from '@/common/types/entities'
import { Box, Icon, Typography } from '@/components/ui'
import Pagination from '@/components/ui/@custom/pagination'
import { useGetEventsQuery, useGetJoinedEventsQuery, usePrefetch } from '@/redux/apis/event.api'
import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { EmptySection } from '../components/shared/empty-section'

import Loading from './loading'
import FeedbackFormModal from './components/feedback-form-modal'
import { useAppSelector } from '@/redux/hook'
import EventCard from './components/event-card'

const MyEventsPage: React.FunctionComponent = () => {
   const [params, setParam] = useQueryParams('page')
   const [openFeedbackFormState, setOpenFeedbackFormState] = useState<boolean>(false)
   const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
   const user = useAppSelector((state) => state.auth.user)
   const { data, isLoading, refetch } = useGetJoinedEventsQuery({
      page: params.page ? Number(params.page) : 1,
      limit: 12,
      ...params
   })

   useEffect(() => {
      if (!params.page) setParam('page', 1)
   }, [params])

   const prefetchNextPage = usePrefetch('getEvents')

   const handlePrefetchNextPage = useCallback(() => {
      if (data?.hasNextPage) prefetchNextPage({ page: +params.page + 1 })
   }, [prefetchNextPage, params])

   return (
      <Box className='h-[calc(100vh-8em)] space-y-10 overflow-y-scroll px-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary'>
         <Box className='space-y-4'>
            <Typography variant='h6' className='inline-flex items-center gap-x-2 text-primary'>
               <Icon name='Newspaper' /> Sự kiện của tôi
            </Typography>
            {isLoading ? (
               <Loading />
            ) : Array.isArray(data?.docs) && data?.docs.length === 0 ? (
               <EmptySection />
            ) : (
               <Box className='grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-1 md:grid-cols-1'>
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
         <FeedbackFormModal
            open={openFeedbackFormState}
            onOpenChange={setOpenFeedbackFormState}
            onAfterFeedback={refetch}
            sender={user!}
            eventId={String(selectedEventId)}
         />
      </Box>
   )
}

export default MyEventsPage
