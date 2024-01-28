import { Badge, Box, Icon, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from '@/components/ui'
import { useGetEventDetailsQuery } from '@/redux/apis/event.api'
import { format } from 'date-fns'
import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import tw from 'tailwind-styled-components'
import ParticipantsList from './components/attendees-list'
import FeedbackList from './components/feedback-list'
import { useGetAllFeedbackByEventQuery } from '@/redux/apis/feedback.api'
import useQueryParams from '@/common/hooks/use-query-params'
import { useGetAttendeesByEventQuery } from '@/redux/apis/attendance.api'

const EventDetailsPage: React.FunctionComponent = () => {
   const { id } = useParams()
   const { data: eventDetails } = useGetEventDetailsQuery(id!, { skip: !id })
   const { data: attendeesList } = useGetAttendeesByEventQuery({ eventId: id!, params: { pagination: false } }, { skip: !id })
   const { data: feedback } = useGetAllFeedbackByEventQuery({ eventId: id! }, { skip: !id })
   const [params, setParams] = useQueryParams()

   useEffect(() => {
      if (!params.tab) setParams('tab', 'participants')
   }, [])

   const handleTabChange = useCallback((value: string) => {
      setParams('tab', value)
   }, [])

   return (
      <Tabs defaultValue={params.tab ?? 'participants'} onValueChange={handleTabChange}>
         <Box className='flex items-start justify-between gap-10 border-b pb-4 sm:flex-col md:flex-col'>
            <Box className='space-y-2'>
               <Typography variant='h6' className='capitalize'>
                  {eventDetails?.name}
               </Typography>
               <Time>
                  <Icon name='Clock' className='text-foreground' />
                  {format(eventDetails?.start_time ?? new Date(), 'dd/MM/yyyy')} - {format(eventDetails?.end_time! ?? new Date(), 'dd/MM/yyyy')}
               </Time>
            </Box>
            <Box className='max-w-full sm:rounded-lg sm:bg-accent sm:px-2'>
               <Box className='max-w-full overflow-x-auto scrollbar-none'>
                  <TabsList className='flex w-fit items-center sm:justify-start'>
                     <TabsTrigger value='participants' className='min-w-fit gap-x-6'>
                        <Box className='flex w-full flex-1 items-center gap-x-2'>
                           <Icon name='Users' />
                           Thành viên
                        </Box>
                        <Badge variant='secondary' className='aspect-square h-5 w-5 justify-center text-xs'>
                           {attendeesList?.length ?? 0}
                        </Badge>
                     </TabsTrigger>
                     <TabsTrigger value='feedback' className='min-w-fit gap-x-4'>
                        <Box className='flex w-full flex-1 items-center gap-x-2'>
                           <Icon name='MessagesSquare' />
                           Feedback
                        </Box>
                        <Badge variant='secondary' className='aspect-square h-5 w-5 justify-center text-xs'>
                           {feedback?.totalDocs ?? 0}
                        </Badge>
                     </TabsTrigger>
                  </TabsList>
               </Box>
            </Box>
         </Box>

         <TabsContent value='participants' className='mt-6 border-none outline-none ring-0'>
            <ParticipantsList />
         </TabsContent>
         <TabsContent value='feedback' className='mt-6 border-none outline-none ring-0'>
            <FeedbackList />
         </TabsContent>
      </Tabs>
   )
}

const Time = tw.time`text-sm text-muted-foreground inline-flex items-center gap-x-2`

export default EventDetailsPage
