import { useCallback, useState, useEffect } from 'react'
import { isJSON } from '../utils/json'

export function useLocalStorage<T>(key: string, defaultValue?: T) {
   return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage<T>(key: string, defaultValue?: T) {
   return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage<T>(key: string, defaultValue: T, storageObject: Storage): [T | undefined, React.Dispatch<T | undefined>, () => void] {
   const [value, setValue] = useState<T | undefined>(() => {
      if (typeof window === 'undefined') return defaultValue
      const jsonValue = storageObject.getItem(key)
      if (isJSON(jsonValue)) return JSON.parse(jsonValue!)
      if (typeof defaultValue === 'function') {
         return defaultValue()
      } else {
         return defaultValue
      }
   })

   useEffect(() => {
      (function () {
         try {
            if (value === undefined) return storageObject.removeItem(key)
            storageObject.setItem(key, JSON.stringify(value))
         } catch (error) {
            console.log((error as Error).message)
         }
      })()
   }, [key, value, storageObject])

   const remove = useCallback(() => {
      setValue(undefined)
   }, [])

   return [value, setValue, remove]
}
