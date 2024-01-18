import { Box, Card, CardContent, CardDescription, CardHeader, CardTitle, DropdownSelect, Icon } from '@/components/ui'
import { useGetStudentStatisticsQuery } from '@/redux/apis/statistics.api'
import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export function Overview() {
   const [time, setTime] = useState<string>(String(new Date().getFullYear()))
   const { data } = useGetStudentStatisticsQuery({ year: time })

   return (
      <Card>
         <CardHeader>
            <Box className='flex items-center justify-between'>
               <Box className='space-y-1'>
                  <CardTitle>Tổng quan</CardTitle>
                  <CardDescription>Số lượng sinh viên tham gia</CardDescription>
               </Box>
               <DropdownSelect
                  onValueChange={setTime}
                  selectTriggerProps={{ className: 'w-28 gap-x-1', children: <Icon name='CalendarDays' /> }}
                  selectProps={{ defaultValue: new Date().getFullYear().toString() }}
                  options={[{ label: new Date().getFullYear().toString(), value: new Date().getFullYear().toString() }]}
               />
            </Box>
         </CardHeader>
         <CardContent className='pl-2'>
            <ResponsiveContainer width='100%' height={350}>
               <BarChart data={data}>
                  <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-primary' />
               </BarChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   )
}
