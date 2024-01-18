import Regex from '@/common/constants/regex'
import { format } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { Box, ScrollArea, Toggle, Typography } from '..'
import { TimeObject, getCurrentDate, parseTime } from '@/common/utils/time'

type TimePickerProps = {
   value?: string
   onChange: (value: string) => unknown
}

type ToggleButtonProps = {
   value: number
   pressed: boolean
   onPressedChange: React.Dispatch<React.SetStateAction<number>>
}

const TimePicker: React.FC<TimePickerProps> = (props) => {
   const [time, setTime] = useState<TimeObject>(() => {
      if (props.value && Regex.time.test(props.value)) return parseTime(props.value)
      return {
         hours: new Date().getHours(),
         minutes: new Date().getMinutes(),
         seconds: new Date().getSeconds()
      }
   })

   useEffect(() => {
      if (props.onChange) {
         const value = format(getCurrentDate(time), 'HH:mm:ss')
         props.onChange(value)
      }
   }, [time])

   return (
      <Box className='px-3'>
         <Typography variant='small' className='mb-3 rounded-lg border p-2 text-center'>
            {time ? format(getCurrentDate(time), 'HH:mm') : '--:--:--'}
         </Typography>
         <Box className='grid grid-cols-2'>
            <ScrollArea className='h-56'>
               <Box className='flex flex-col items-center justify-center gap-y-1 p-2'>
                  {Array.apply(null, Array(24)).map((_, i) => (
                     <ToggleButton value={i} pressed={time.hours === i} onPressedChange={() => setTime((prev) => ({ ...prev, hours: i }))} />
                  ))}
               </Box>
            </ScrollArea>
            <ScrollArea className='h-56'>
               <Box className='flex flex-col items-center justify-center gap-y-1 p-2'>
                  {Array.apply(null, Array(60)).map((_, i) => (
                     <ToggleButton value={i} pressed={time.minutes === i} onPressedChange={() => setTime((prev) => ({ ...prev, minutes: i }))} />
                  ))}
               </Box>
            </ScrollArea>
         </Box>
      </Box>
   )
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ value, pressed, onPressedChange }) => {
   const ref = useRef<typeof Toggle.prototype>(null)

   useEffect(() => {
      if (pressed && ref.current) ref.current.scrollIntoView()
   }, [pressed])

   return (
      <Toggle ref={ref} className='h-8 w-8' pressed={pressed} onPressedChange={() => onPressedChange(value)}>
         {value.toString().padStart(2, '0')}
      </Toggle>
   )
}

export default TimePicker
