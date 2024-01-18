import { Box, Icon } from '@/components/ui'

export const EmptySection: React.FunctionComponent = () => {
   return (
      <Box className='flex min-h-[24rem] w-full flex-col items-center justify-center gap-6 text-center text-muted-foreground'>
         <Icon name='PackageOpen' size={48} className='text-muted-foreground' />
         Chưa có sự kiện nào
      </Box>
   )
}
