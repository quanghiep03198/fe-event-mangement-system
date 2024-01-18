import React, { memo } from 'react'
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from '..'

type ConfirmDialogProps = {
   open: boolean
   title: string
   description: string
   confirmText?: string
   cancelText?: string
   onOpenStateChange: React.Dispatch<React.SetStateAction<boolean>>
   onConfirm: (...args: any[]) => any
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
   return (
      <AlertDialog open={props.open} onOpenChange={props.onOpenStateChange}>
         <AlertDialogContent>
            <AlertDialogHeader className='text-left'>
               <AlertDialogTitle>{props.title}</AlertDialogTitle>
               <AlertDialogDescription>{props.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='!flex-row !justify-end'>
               <AlertDialogCancel onClick={() => props.onOpenStateChange(!props.open)}>{props.cancelText}</AlertDialogCancel>
               <AlertDialogAction
                  onClick={() => {
                     if (props.onConfirm) props.onConfirm()
                  }}
               >
                  {props.confirmText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

ConfirmDialog.defaultProps = {
   confirmText: 'Ok',
   cancelText: 'Hủy'
}

export default memo(ConfirmDialog)
