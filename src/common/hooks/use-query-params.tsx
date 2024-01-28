import _ from 'lodash'
import { useSearchParams } from 'react-router-dom'

export default function useQueryParams(...path: string[]): [Record<string, string>, (key: string, value: any) => void, (key: string) => void] {
   const [searchParmams, setSearchParams] = useSearchParams()
   const params =
      path.length === 0 ? Object.fromEntries(searchParmams.entries()) : (_.pick(Object.fromEntries(searchParmams.entries()), path) as Record<string, string>)

   const setParam = (key: string, value: any) =>
      setSearchParams((params) => {
         params.set(key, value)
         return params
      })

   const removeParam = (key: string) => {
      setSearchParams((params) => {
         params.delete(key)
         return params
      })
   }

   return [params, setParam, removeParam]
}
