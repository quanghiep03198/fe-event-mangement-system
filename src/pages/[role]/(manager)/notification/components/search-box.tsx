import {
   Box,
   Button,
   ComboboxFieldControl,
   DatePickerFieldControl,
   Form,
   Icon,
   Input,
   InputFieldControl,
   Popover,
   PopoverContent,
   PopoverTrigger,
   SelectFieldControl
} from '@/components/ui'
import { useGetEventsQuery } from '@/redux/apis/event.api'
import { useGetUsersQuery } from '@/redux/apis/user.api'
import { FilterNotificationSchema } from '@/schemas/notification.schema'
import { debounce } from 'lodash'
import { memo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

type SearchBoxProps = {
   onSearchOptionsChange: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

type FormValue = z.infer<typeof FilterNotificationSchema>

const filterTypeOptions = [
   { label: 'Tất cả', value: 'all' },
   { label: 'Đã gửi', value: 'sent' },
   { label: 'Đã lên lịch', value: 'scheduled' }
]

const SearchBox: React.FC<SearchBoxProps> = ({ onSearchOptionsChange: handleSearchOptionsChange }) => {
   const [searchEvent, setSearchEvent] = useState<string>('')
   const [open, setOpen] = useState<boolean>(false)
   const { data: events } = useGetEventsQuery({ pagination: false, search: searchEvent })
   const { data: users } = useGetUsersQuery({ pagination: false, search: searchEvent })
   const form = useForm<Partial<FormValue>>()
   const formRef = useRef<HTMLFormElement>(null)

   const handleSearch = (data: FormValue) => {
      handleSearchOptionsChange(data)
      setOpen(false)
   }

   const handleResetForm = () => {
      formRef.current.reset()
      form.reset()
      handleSearch({})
      setOpen(false)
      setSearchEvent('')
   }

   return (
      <Box className='group relative w-full rounded-lg border @xs:basis-full'>
         <Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
         <Input
            className='border-none px-9 group-focus:border-primary'
            placeholder='Tìm kiếm'
            type='search'
            onChange={debounce((e) => handleSearchOptionsChange({ ...form.getValues(), title: e.target.value }), 500)}
         />
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button size='icon' variant='ghost' className='absolute right-2 top-1/2 aspect-square h-6 w-6 -translate-y-1/2'>
                  <Icon name='SlidersHorizontal' size={14} />
               </Button>
            </PopoverTrigger>
            <PopoverContent align='center' className='w-96 xl:w-fit' sideOffset={12}>
               <Form {...form}>
                  <SearchForm ref={formRef} onSubmit={form.handleSubmit(handleSearch)}>
                     <Box className='col-span-full xl:col-span-1'>
                        <SelectFieldControl
                           name='type'
                           control={form.control}
                           className='h-8'
                           defaultValue={filterTypeOptions[0].value}
                           label='Tìm kiếm'
                           layout='horizontal'
                           options={filterTypeOptions}
                        />
                     </Box>
                     <Box className='col-span-full xl:col-span-1'>
                        <ComboboxFieldControl
                           name='event'
                           form={form}
                           control={form.control}
                           onInput={setSearchEvent}
                           label='Đến sự kiện'
                           placeholder='Chọn sự kiện'
                           layout='horizontal'
                           options={Array.isArray(events) ? events.map((item) => ({ label: item.name, value: item.id })) : []}
                        />
                     </Box>
                     <Box className='col-span-full xl:col-span-1'>
                        <InputFieldControl
                           name='title'
                           control={form.control}
                           className='h-8'
                           label='Tiêu đề'
                           layout='horizontal'
                           placeholder='Tiêu đề thông báo ...'
                        />
                     </Box>
                     <Box className='col-span-full xl:col-span-1'>
                        <ComboboxFieldControl
                           name='sender'
                           form={form}
                           control={form.control}
                           onInput={setSearchEvent}
                           label='Người tạo'
                           placeholder='Chọn người gửi'
                           layout='horizontal'
                           options={Array.isArray(users) ? users.map((item) => ({ label: item.name, value: item.id })) : []}
                        />
                     </Box>
                     <Box className='col-span-full xl:col-span-1'>
                        <DatePickerFieldControl name='from_date' control={form.control} layout='horizontal' label='Từ ngày' />
                     </Box>
                     <Box className='col-span-full xl:col-span-1'>
                        <DatePickerFieldControl name='to_date' control={form.control} layout='horizontal' label='Đến ngày' />
                     </Box>
                     <Box className='col-span-2 mt-6 flex justify-end gap-x-2'>
                        {Object.values(form.getValues()).length > 0 && (
                           <Button type='button' variant='ghost' size='sm' className='gap-x-2' onClick={handleResetForm}>
                              <Icon name='X' /> Xóa lọc
                           </Button>
                        )}
                        <Button type='submit' size='sm' className='gap-x-2'>
                           <Icon name='Search' />
                           Tìm kiếm
                        </Button>
                     </Box>
                  </SearchForm>
               </Form>
            </PopoverContent>
         </Popover>
      </Box>
   )
}

const SearchForm = tw.form`grid xl:grid-cols-2 gap-y-4 xl:gap-x-4 w-full`

export default memo(SearchBox)
