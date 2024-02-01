import copy from 'copy-to-clipboard'
import { useState } from 'react'

export default function useCopyToClipboard(): [(...parameters: Parameters<typeof copy>) => void, { data: string; isSuccess: boolean }] {
   const [data, setData] = useState<string>('')
   const [isSuccess, setIsSuccess] = useState<boolean>(false)

   const copyToClipboard = (text: string, options: Parameters<typeof copy>[1]) => {
      const result = copy(text, options)
      if (result) setData(text)
      setIsSuccess(result)
   }

   return [copyToClipboard, { data, isSuccess }]
}
