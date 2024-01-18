import { Box, Typography } from '@/components/ui'
import { Overview } from './components/overview'
import { RecentEvents } from './components/recent-events'
import Statistics from './components/statistics'

const DashboardPage: React.FunctionComponent = () => {
   return (
      <Box className='space-y-6'>
         <Box className='space-y-1'>
            <Typography variant='h6'>Dashboard</Typography>
            <Typography variant='small' color='muted'>
               Thống kê tổng quan
            </Typography>
            {/* <DateRangePicker align='end' /> */}
         </Box>
         <Statistics />
         <Box className='grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-[1.75fr_1fr]'>
            <Overview />
            <RecentEvents />
         </Box>
      </Box>
   )
}

export default DashboardPage
