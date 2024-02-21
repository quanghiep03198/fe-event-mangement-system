import { EventInterface } from '@/common/types/entities'
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useGetRecentEventsQuery } from '@/redux/apis/event.api'

const EventItem: React.FC<{ data: EventInterface }> = ({ data }) => {
   return (
      <div className='grid grid-cols-[2fr_1fr] items-start'>
         <div className='space-y-1'>
            <p className='text-sm font-medium leading-none'>{data?.name}</p>
            <p className='text-sm text-muted-foreground'>
               {data?.start_time.toString()} - {data?.end_time?.toString()}
            </p>
         </div>
         <div className='ml-auto font-medium'>
            <Badge variant={'success'}>{data.status}</Badge>
         </div>
      </div>
   )
}

export const RecentEvents: React.FunctionComponent = () => {
   const { data } = useGetRecentEventsQuery()
   return (
      <Card>
         <CardHeader>
            <CardTitle>Sự kiện gần đây</CardTitle>
         </CardHeader>
         <CardContent className='h-[calc(100%-4rem)]'>
            {Array.isArray(data) && data.length > 0 ? (
               <div className='space-y-8'>{Array.isArray(data) && data.map((item) => <EventItem key={item.id} data={item} />)}</div>
            ) : (
               <div className='flex h-full items-center justify-center text-muted-foreground'>Chưa có sự kiện nào gần đây</div>
            )}
         </CardContent>
      </Card>
   )
}
