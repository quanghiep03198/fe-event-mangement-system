import { NotificationInterface } from '@/common/types/entities'
import { createContext, useState } from 'react'

export const NotificationContext = createContext<{
   selectedNotification: Partial<NotificationInterface> | undefined
   setSelectedNotification: React.Dispatch<React.SetStateAction<Partial<NotificationInterface> | undefined>>
}>({ selectedNotification: undefined, setSelectedNotification: () => {} })

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
   const [selectedNotification, setSelectedNotification] = useState<Partial<NotificationInterface> | undefined>()

   return <NotificationContext.Provider value={{ selectedNotification, setSelectedNotification }}>{children}</NotificationContext.Provider>
}
