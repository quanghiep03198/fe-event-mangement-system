import { Cloudinary } from '@/services/cloudinary.service'
import { useState } from 'react'

export default function useCloudinaryUpload(): [(file: File) => Promise<string | undefined>, boolean, boolean] {
   const [isLoading, setIsLoading] = useState<boolean>(false)
   const [isError, setIsError] = useState<boolean>(false)

   const upload = async (file: File) => {
      try {
         setIsLoading(true)
         return await Cloudinary.upload(file)
      } catch (error) {
         setIsError(true)
         return null
      } finally {
         setIsLoading(false)
      }
   }

   return [upload, isLoading, isError]
}
