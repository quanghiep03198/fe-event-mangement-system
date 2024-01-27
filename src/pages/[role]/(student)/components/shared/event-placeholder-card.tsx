import { Box, Card, CardContent, CardFooter, CardHeader, Skeleton } from '@/components/ui'

export const VerticalPlaceholderCard: React.FunctionComponent = () => {
   return (
      <Card className='max-w-72 w-full overflow-clip'>
         {
            <CardHeader className='p-0'>
               <Skeleton className='h-52' />
            </CardHeader>
         }
         <CardContent className='flex flex-col gap-y-2 px-3 py-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-3 w-1/2' />
            <Box className='my-2 flex flex-col space-y-2'>
               <Skeleton className='h-2 w-full' />
               <Skeleton className='h-2 w-full' />
               <Skeleton className='h-2 w-full' />
            </Box>
            <Skeleton className='h-3 w-1/2' />
         </CardContent>
         <CardFooter className='mt-2 justify-center px-3'>
            <Skeleton className='h-10 w-full' />
         </CardFooter>
      </Card>
   )
}

export const HorizontalPlaceholderCard: React.FunctionComponent = () => {
   return (
      <Box className='grid h-fit grid-cols-1 gap-4 rounded-lg border p-2 shadow xl:grid-cols-[1fr_2fr] xl:gap-6'>
         <Skeleton className='aspect-video h-[12rem] w-full min-w-[12rem] max-w-full rounded-lg object-cover object-center lg:max-w-full xl:aspect-square xl:max-w-[12rem]' />

         <Box className='flex max-w-full flex-col justify-between gap-y-6'>
            <Box className='space-y-2'>
               <Skeleton className='h-4 w-full' />
               <Skeleton className='h-3 w-1/2' />
               <Skeleton className='h-2 w-full' />
               <Skeleton className='h-2 w-full' />
               <Skeleton className='h-2 w-full' />
            </Box>
            <Box className='flex items-end justify-end gap-x-2 self-end'>
               <Skeleton className='h-8 w-24 max-w-full' />
               <Skeleton className='h-8 w-24 max-w-full' />
            </Box>
         </Box>
      </Box>
   )
}
