import { EventStatusValues } from '@/common/constants/constants'
import { EventStatus, FeedbackStatus, JoinEventStatus } from '@/common/constants/enums'
import { Paths } from '@/common/constants/pathnames'
import { EventInterface } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Badge, Box, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, Icon, Image, Typography } from '@/components/ui'
import { usePrefetch } from '@/redux/apis/event.api'
import { useAppSelector } from '@/redux/hook'
import { addDays, format, isAfter, isBefore } from 'date-fns'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import FeedbackFormModal from './feedback-form-modal'
import Tooltip from '@/components/ui/@override/tooltip'

export const EventVerticalCard: React.FC<{
   data: EventInterface
}> = ({ data }) => {
   const prefetchPage = usePrefetch('getEventDetails')

   return (
      <>
         <Card className='w-full overflow-clip transition-transform duration-200 ease-in-out'>
            <CardHeader className='group relative h-52 space-y-0 p-2'>
               <Image src={data?.banner} height={208} width='100%' className='aspect-[16/9] h-full max-w-full rounded-lg object-cover' />
            </CardHeader>
            <CardContent className='grid gap-y-2 px-3 py-2'>
               <Box className='flex items-center justify-between'>
                  <Link className='line-clamp-1 font-medium underline-offset-2 hover:underline' to='#'>
                     {data?.name}
                  </Link>
                  {data?.status_join === JoinEventStatus.ALREADY && (
                     <Tooltip content='Đã tham gia'>
                        <Icon name='CheckCircle' className='text-success' />
                     </Tooltip>
                  )}
               </Box>
               <CardDescription className='inline-flex items-center space-x-2'>
                  <Icon name='Calendar' />
                  <time>
                     {format(data?.start_time, 'dd/MM/yyyy')} - {format(data?.end_time, 'dd/MM/yyyy')}
                  </time>
               </CardDescription>
               <CardDescription className='flex items-center space-x-2'>
                  <Icon name='User' className='basis-4' />
                  <span className='line-clamp-1'>{data?.user?.name}</span>
               </CardDescription>

               <Badge
                  variant={data?.status === EventStatus.ACTIVE ? 'success' : data?.status === EventStatus.UPCOMING ? 'warning' : 'destructive'}
                  className='w-fit'
               >
                  {EventStatusValues.get(data.status)}
               </Badge>
            </CardContent>
            <CardFooter className={cn('mt-2 items-stretch gap-x-2 px-3')}>
               <Button asChild size='sm' variant='default' className='w-full' onMouseEnter={() => prefetchPage(String(data?.id))}>
                  <Link to={Paths.EVENTS_DETAILS.replace(':id', String(data?.id))}>Chi tiết</Link>
               </Button>
            </CardFooter>
         </Card>
      </>
   )
}

export const EventHorizontalCard: React.FC<{ data: EventInterface }> = ({ data }) => {
   const prefetchPage = usePrefetch('getEventDetails')
   const [open, setOpen] = useState<boolean>(false)
   const user = useAppSelector((state) => state.auth.user)

   return (
      <>
         {data?.status_join === JoinEventStatus.ALREADY && <FeedbackFormModal open={open} onOpenChange={setOpen} sender={user!} eventId={String(data?.id!)} />}
         <Box className='grid h-fit grid-cols-[1fr_2fr] gap-6 rounded-lg border p-4 shadow md:grid-cols-[1fr_3fr]'>
            <Image
               src={data?.banner}
               className='aspect-square h-[12rem] w-full min-w-[12rem] max-w-[12rem] rounded-lg object-cover object-center'
               width='100%'
            />

            <Box className='flex flex-col justify-between'>
               <Box className='space-y-2'>
                  <Link to={Paths.EVENTS_DETAILS.replace(':id', String(data?.id))} className='underline-offset-2 hover:underline'>
                     {' '}
                     <Typography className='capitalize'>{data?.name}</Typography>
                  </Link>
                  <Typography variant='small' className='flex items-center gap-x-2 text-sm text-muted-foreground'>
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
                        onClick={() => setOpen(true)}
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
      </>
   )
}
