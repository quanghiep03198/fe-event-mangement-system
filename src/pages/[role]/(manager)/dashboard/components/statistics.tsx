import { Box, Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, Typography } from '@/components/ui'
import { IconProps } from '@/components/ui/@shadcn/icon'
import { useGetStatisticsQuery } from '@/redux/apis/statistics.api'
import React, { useMemo } from 'react'

type StatisticData = {
   title: string
   icon: IconProps['name']
   statisticValue: number
   growPercentage: number
}

const Statistics: React.FunctionComponent = () => {
   const { data } = useGetStatisticsQuery()

   const statistics: Array<StatisticData> = useMemo(
      () => [
         {
            title: 'Sự kiện đã tổ chức',
            icon: 'CalendarCheck',
            statisticValue: data?.eventInCurrentMonth ?? 0,
            growPercentage: data?.percentInEvent ?? 0
         },
         {
            title: 'Sinh viên',
            icon: 'UsersRound',
            statisticValue: data?.joinEventInCurrentMonth ?? 0,
            growPercentage: data?.percentInJoinEvent ?? 0
         },
         {
            title: 'Feedback',
            icon: 'MessagesSquare',
            statisticValue: data?.feedBackInCurrentMonth ?? 0,
            growPercentage: data?.percentInFeedBack ?? 0
         }
      ],
      [data]
   )
   return (
      <Box className='grid grid-cols-4 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
         {statistics.map((stats, index) => (
            <Card key={index}>
               <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>{stats.title}</CardTitle>
                  <Icon name={stats.icon} className='text-muted-foreground' size={18} />
               </CardHeader>
               <CardContent>
                  <Typography variant='h5' className='font-bold'>
                     {new Intl.NumberFormat().format(stats?.statisticValue)}
                  </Typography>
                  <CardDescription>{stats?.growPercentage}% so với tháng trước</CardDescription>
               </CardContent>
            </Card>
         ))}
         <Card className='order-3'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
               <CardTitle className='text-sm font-medium'>Cộng tác viên</CardTitle>
               <Icon name='UserRoundPlus' className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
               <Typography variant='h5' className='font-bold'>
                  {new Intl.NumberFormat().format(data?.userInRoleStaff ?? 0)}
               </Typography>
               <CardDescription>Từ trước đến nay</CardDescription>
            </CardContent>
         </Card>
      </Box>
   )
}

export default Statistics
