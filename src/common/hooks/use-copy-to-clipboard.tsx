import copy from 'copy-to-clipboard'
import { useState } from 'react'

export default function useCopyToClipboard(): [(...parameters: Parameters<typeof copy>) => void, { value: string; success: boolean }] {
   const [value, setValue] = useState<string>('')
   const [success, setSuccess] = useState<boolean>(false)

   const copyToClipboard = (text: string, options: Parameters<typeof copy>[1]) => {
      const result = copy(text, options)
      if (result) setValue(text)
      setSuccess(result)
   }

   return [copyToClipboard, { value, success }]
}
