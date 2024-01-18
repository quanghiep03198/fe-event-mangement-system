import useQueryParams from '@/common/hooks/use-query-params'
import { Badge, Box, DropdownSelect, Icon, Input, Toggle, Typography } from '@/components/ui'
import { debounce } from 'lodash'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

type SearchBoxProps = {
   onSearchValueChange: React.Dispatch<React.SetStateAction<string>>
   onSortChange: React.Dispatch<React.SetStateAction<string>>
}

const locationOptions: Record<'label' | 'value', string>[] = [
   { label: 'Hà Nội', value: 'Hà Nội' },
   { label: 'Hải Phòng', value: 'Hải Phòng' },
   { label: 'Thái Nguyên', value: 'Thái Nguyên' },
   { label: 'Hà Nam', value: 'Hà Nam' },
   { label: 'Thanh Hoá', value: 'Thanh Hoá' },
   { label: 'Quy Nhơn', value: 'Quy Nhơn' },
   { label: 'Đà Nẵng', value: 'Đà Nẵng' },
   { label: 'Tây Nguyên', value: 'Tây Nguyên' },
   { label: 'Đồng Nai', value: 'Đồng Nai' },
   { label: 'Hồ Chí Minh', value: 'Hồ Chí Minh' },
   { label: 'Cần Thơ', value: 'Cần Thơ' }
]

const postedTimeOptions: Record<'label' | 'value', string>[] = [
   { label: 'Mới nhất', value: 'latest' },
   { label: 'Cũ nhất', value: 'oldest' }
]

const keywords = ['Happy Bee', 'Hackathon', 'Poly Microsoft Office', 'Poly Running']

const SearchBox: React.FC<SearchBoxProps> = ({ onSearchValueChange, onSortChange }) => {
   const [_, setSearchParam, removeParam] = useQueryParams()

   const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchValueChange(e.target.value)
      removeParam('page')
   }, 500)

   return (
      <Box className='space-y-6'>
         <Box className='grid grid-cols-4 gap-4'>
            <Box className='relative sm:col-span-4'>
               <Input className='pl-8' placeholder='Tên sự kiện ...' onChange={handleSearch} />
               <Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/50' />
            </Box>
            <DropdownSelect
               selectTriggerProps={{ className: 'sm:col-span-2' }}
               options={postedTimeOptions}
               placeholder='Ngày đăng'
               onValueChange={(value) => {
                  onSortChange(value as string)
               }}
            />
         </Box>
      </Box>
   )
}

export default SearchBox

{
   /* <Box className='flex items-center gap-4 sm:flex-col sm:items-start md:flex-col md:items-start'>
   <Typography variant='h6' className='text-base'>
      Đề xuất cho bạn
   </Typography>
   <Box className='space-x-1'>
      {keywords.map((item) => (
         <Toggle
            key={item}
            size='sm'
            className='cursor-pointer text-xs'
            onPressedChange={(pressed) => {
               if (pressed) {
                  onSearchValueChange(item)
                  removeParam('page')
               } else {
                  onSearchValueChange('')
               }
            }}
         >
            {item}
         </Toggle>
      ))}
   </Box>
</Box> */
}

{
   /* <DropdownSelect
   selectTriggerProps={{ className: 'sm:col-span-2' }}
   options={locationOptions}
   placeholder='Địa điểm'
   onValueChange={() => {
      toast.info('Chức năng hiện đang được cập nhật')
   }}
/> */
}
