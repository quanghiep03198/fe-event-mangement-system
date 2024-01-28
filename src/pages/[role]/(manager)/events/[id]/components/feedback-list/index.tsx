import { FeedbackInterface } from '@/common/types/entities'
import { Box, Icon, ScrollArea } from '@/components/ui'
import { useGetAllFeedbackByEventQuery } from '@/redux/apis/feedback.api'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Feedback from './feedback-card'
import FeedbackDetails from './feedback-details'
import SimplePagination from '../../../../components/shared/simple-pagination'
import useQueryParams from '@/common/hooks/use-query-params'

const FeedbackList: React.FunctionComponent = () => {
   const { id } = useParams()
   const [params, setParam, removeParam] = useQueryParams()
   const { data } = useGetAllFeedbackByEventQuery({ eventId: id!, params: { limit: 10, page: params.page } })

   useEffect(() => {
      if (data?.totalDocs > 0 && !params.feedback) setParam('feedback', data?.docs[0]?.id)
      if (data?.totalDocs === 0 && params.feedback) removeParam('feedback')
   }, [data, params])

   return (
      <Box className='grid grid-cols-[1.5fr_1fr] items-stretch divide-x divide-border rounded-lg border sm:grid-cols-1 md:grid-cols-1'>
         <Box className='flex flex-col items-stretch divide-y divide-border'>
            <Box className='m-0 max-h-[4rem] basis-[4rem] p-4'>
               <SimplePagination hasNextPage={data?.hasNextPage} hasPrevPage={data?.hasPrevPage} totalDocs={data?.totalDocs} totalPages={data?.totalPages} />
            </Box>
            <Box className='py-4'>
               <ScrollArea className='h-[calc(90vh-4.75rem)] px-4'>
                  {Array.isArray(data?.docs) && data.totalDocs > 0 ? (
                     <Box className='flex flex-col gap-y-4'>
                        {data.docs.map((item: FeedbackInterface) => (
                           <Feedback key={item.id} data={item} />
                        ))}
                     </Box>
                  ) : (
                     <EmptySection />
                  )}
               </ScrollArea>
            </Box>
         </Box>

         <FeedbackDetails />
      </Box>
   )
}

const EmptySection: React.FunctionComponent = () => {
   return (
      <Box className='flex h-[calc(90vh-4.75rem)] w-full items-center justify-center gap-x-4 text-muted-foreground'>
         <Icon name='MailX' size={32} strokeWidth={1} /> Chưa có phản hồi nào
      </Box>
   )
}

export default FeedbackList
