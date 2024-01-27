import { EventInterface } from '@/common/types/entities'
import { Button, ComboboxFieldControl, Dialog, DialogContent, Form, Icon } from '@/components/ui'
import { useMoveAttendeeToEventMutation } from '@/redux/apis/attendance.api'
import { useGetEventsQuery } from '@/redux/apis/event.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { debounce } from 'lodash'
import React, { useMemo, useState } from 'react'
import { Path, PathValue, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ChangeAttendeeToEventModalProps = {
   open: boolean
   onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
   selectedAttendee: number
}

const Schema = z.object({ event_id: z.string({ required_error: 'Vui lòng chọn một sự kiện' }).or(z.number({ required_error: 'Vui lòng chọn một sự kiện' })) })

type FormValue = z.infer<typeof Schema>

const MoveAttendeeToEventModal: React.FC<ChangeAttendeeToEventModalProps> = (props) => {
   const [moveAttendee, { isLoading }] = useMoveAttendeeToEventMutation()
   const [eventSearchTerm, setEventSearchTerm] = useState<string>('')
   const { data: events } = useGetEventsQuery({ page: 1, limit: 10, search: eventSearchTerm }, { refetchOnMountOrArgChange: true })
   const form = useForm<FormValue>({ resolver: zodResolver(Schema) })

   const defaultEventOptions = useMemo(() => {
      const data = events as Pagination<EventInterface>
      return Array.isArray(data?.docs) ? data.docs.map((item) => ({ label: item.name, value: String(item.id) as PathValue<FormValue, Path<FormValue>> })) : []
   }, [events])

   const handleMoveUserToEvent = (data: Required<FormValue>) => {
      toast.promise(moveAttendee({ id: props.selectedAttendee, payload: { event_id: +data.event_id, user_id: props.selectedAttendee } }), {
         loading: 'Đang chuyển người dùng qua sự kiện khác...',
         success: () => {
            form.reset()
            props.onOpenChange(false)
            return 'Đã chuyển người dùng qua sự kiện khác'
         },
         error: 'Cập nhật thất bại'
      })
   }

   return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
         <DialogContent>
            <Form {...form}>
               <form className='flex flex-col gap-6' onSubmit={form.handleSubmit(handleMoveUserToEvent)}>
                  <ComboboxFieldControl
                     name='event_id'
                     form={form}
                     control={form.control}
                     label='Sự kiện'
                     placeholder='Chọn sự kiện ...'
                     onInput={debounce((value) => setEventSearchTerm(value), 200)}
                     options={defaultEventOptions}
                     description='Sinh viên sẽ được chuyển đến sự kiện đã chọn'
                  />
                  <Button type='submit' className='gap-x-2'>
                     <Icon name='CheckCircle' /> Ok
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default MoveAttendeeToEventModal
