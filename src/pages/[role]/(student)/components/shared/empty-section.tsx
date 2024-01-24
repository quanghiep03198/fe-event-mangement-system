import useQueryParams from '@/common/hooks/use-query-params'
import { Box, Icon } from '@/components/ui'
import { isEmpty } from 'lodash'

export const EmptySection: React.FunctionComponent = () => {
   const [params] = useQueryParams()

   return (
      <Box className='flex min-h-[24rem] w-full flex-col items-center justify-center gap-6 text-center text-muted-foreground'>
         <Icon name={isEmpty(params) ? 'PackageOpen' : 'SearchX'} size={48} strokeWidth={1} className='text-muted-foreground' />
         {isEmpty(params) ? 'Chưa có sự kiện nào' : 'Không có kết quả phù hợp'}
      </Box>
   )
}
