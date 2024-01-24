import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus, FeedbackStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { EventInterface } from '@/common/types/entities'
import { Badge, Box, Button, Icon, Image, Typography } from '@/components/ui'
import { usePrefetch } from '@/redux/apis/event.api'
import { addDays, format, isAfter, isBefore } from 'date-fns'
import { Link } from 'react-router-dom'

const EventCard: React.FC<{ data: EventInterface; onSelectEventToFeedback: React.Dispatch<React.SetStateAction<number>> }> = ({
   data,
   onSelectEventToFeedback
}) => {
   const prefetchPage = usePrefetch('getEventDetails')

   return (
      <Box className='grid h-fit grid-cols-[1fr_2fr] gap-6 rounded-lg border p-4 shadow md:grid-cols-[1fr_3fr]'>
         <Image src={data?.banner} className='aspect-square h-[12rem] w-full min-w-[12rem] max-w-[12rem] rounded-lg object-cover object-center' width='100%' />

         <Box className='flex flex-col justify-between'>
            <Box className='mb-6 space-y-2'>
               <Link to={Paths.EVENTS_DETAILS.replace(':id', String(data?.id))} className='underline-offset-2 hover:underline'>
                  <Typography className='capitalize'>{data?.name}</Typography>
               </Link>
               <Typography variant='small' className='flex items-center gap-x-2 text-sm'>
                  <Icon name='Clock' />
                  {format(data?.start_time, 'dd/MM/yyyy')} - {format(data?.end_time, 'dd/MM/yyyy')}
               </Typography>
               <Typography variant='small' color='muted' className='flex items-center gap-x-2'>
                  <Icon name='Users' /> {data?.attendances.length} người tham gia
               </Typography>
               <Badge
                  variant={data?.status === EventStatus.ACTIVE ? 'success' : data?.status === EventStatus.UPCOMING ? 'warning' : 'destructive'}
                  className='w-fit'
               >
                  {EventStatusValues.get(data.status)}
               </Badge>
               <Typography variant='small' color='muted' className='line-clamp-2 h-8 text-xs'>
                  {data.description ?? 'Chưa có mô tả'}
               </Typography>
            </Box>
            <Box className='flex items-stretch justify-end gap-x-2 self-end'>
               {data.status_feedBack_join === FeedbackStatus.ALREADY ? (
                  <Badge className='gap-x-2' variant='success'>
                     <Icon name='CheckCircle' /> Đã feedback
                  </Badge>
               ) : (
                  <Button
                     variant='outline'
                     className='gap-x-2'
                     size='sm'
                     disabled={isBefore(new Date(), new Date(data.start_time)) || isAfter(new Date(), new Date(addDays(new Date(data.end_time), 1)))}
                     onClick={() => onSelectEventToFeedback(data.id)}
                  >
                     <Icon name='Reply' /> Feedback
                  </Button>
               )}
               <Button asChild variant='default' className='gap-x-2' size='sm' onMouseEnter={() => prefetchPage(String(data?.id))}>
                  <Link to={Paths.EVENTS_DETAILS.replace(':id', String(data.id))}>
                     <Icon name='MousePointerClick' /> Chi tiết
                  </Link>
               </Button>
            </Box>
         </Box>
      </Box>
   )
}

export default EventCard
