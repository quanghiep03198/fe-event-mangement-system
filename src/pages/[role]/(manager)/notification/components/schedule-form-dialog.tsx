import { Box, Button, Calendar, Dialog, DialogContent, DialogFooter, Form, FormField, FormItem, FormMessage } from '@/components/ui'
import TimePicker from '@/components/ui/@custom/time-picker'
import { TimeSendSchema } from '@/schemas/notification.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { compareDesc, format, isAfter, isBefore } from 'date-fns'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ScheduleFormDialogProps = {
   openState: boolean
   defaultValue?: string
   timeEnd?: string
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
   onValueChange: (value: string | null) => void
}

type FormValue = z.infer<ReturnType<typeof TimeSendSchema>>

const ScheduleFormDialog: React.FC<ScheduleFormDialogProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(TimeSendSchema({ timeEnd: props.timeEnd }))
   })

   useEffect(() => {
      if (props.defaultValue) {
         form.reset({
            date: props.defaultValue,
            time: format(props.defaultValue, 'HH:mm')
         })
      }
   }, [props.defaultValue])

   const handleSetTimeSend = (data: FormValue) => {
      props.onValueChange(Object.values(data).join(' '))
      props.onOpenStateChange(false)
   }

   const handleCancelSetSchedule = () => {
      props.onOpenStateChange(false)
      props.onValueChange(null)
   }

   return (
      <Dialog open={props.openState} onOpenChange={props.onOpenStateChange}>
         <DialogContent className='w-fit pt-10'>
            <Form {...form}>
               <form
                  onSubmit={(e) => {
                     e.stopPropagation()
                     form.handleSubmit(handleSetTimeSend)(e)
                  }}
                  className='flex flex-col items-stretch gap-6'
               >
                  <Box className='flex divide-x divide-border sm:flex-col'>
                     <FormField
                        name='date'
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <Calendar
                                 mode='single'
                                 selected={new Date(field.value)}
                                 className='w-fit py-0'
                                 onSelect={field.onChange}
                                 disabled={(date) => isBefore(date, new Date()) || isAfter(date, new Date(props.timeEnd))}
                              />
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        name='time'
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <TimePicker
                                 value={field.value}
                                 onChange={(value) => {
                                    field.onChange(value)
                                 }}
                              />
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </Box>

                  <DialogFooter className='flex-row justify-end gap-x-2'>
                     <Button type='button' variant='ghost' onClick={handleCancelSetSchedule}>
                        Hủy
                     </Button>
                     <Button type='submit'>Ok</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default ScheduleFormDialog
