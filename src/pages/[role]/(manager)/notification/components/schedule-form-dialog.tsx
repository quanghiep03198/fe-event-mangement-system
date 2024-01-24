import { Box, Button, Calendar, Dialog, DialogContent, DialogFooter, Form, FormField, FormItem, FormMessage } from '@/components/ui'
import TimePicker from '@/components/ui/@custom/time-picker'
import { TimeSendSchema } from '@/schemas/notification.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isAfter } from 'date-fns'
import { pick } from 'lodash'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ScheduleFormDialogProps = {
   openState: boolean
   defaultValue?: string
   maxValue?: string | Date
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
   onValueChange: (value: string | null) => void
}

type FormValue = z.infer<ReturnType<typeof TimeSendSchema>>

const ScheduleFormDialog: React.FC<ScheduleFormDialogProps> = (props) => {
   const form = useForm<FormValue>({
      resolver: zodResolver(TimeSendSchema(pick(props, ['maxValue'])))
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
         <DialogContent className='w-full max-w-xl pt-10 sm:max-w-xs'>
            <Form {...form}>
               <form
                  onSubmit={(e) => {
                     e.stopPropagation()
                     form.handleSubmit(handleSetTimeSend)(e)
                  }}
                  className='flex flex-col items-stretch gap-6'
               >
                  <Box className='grid grid-cols-2 divide-x divide-border sm:grid-cols-1 sm:gap-y-4 sm:divide-x-0'>
                     <FormField
                        name='date'
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <Calendar
                                 mode='single'
                                 selected={new Date(field.value)}
                                 className='w-full py-0'
                                 fromDate={new Date()}
                                 onSelect={field.onChange}
                                 disabled={(date) => isAfter(date, new Date(props.maxValue))}
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
                              <FormMessage className='pl-4' />
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
