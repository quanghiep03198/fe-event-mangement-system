import { createContext, useState } from 'react'

type EditorContextType = {
   imageFormOpenState: boolean
   setImageFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditorContext = createContext<EditorContextType>({ imageFormOpenState: false, setImageFormOpen: () => {} })

export const EditorContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
   const [imageFormOpenState, setImageFormOpen] = useState<boolean>()

   return <EditorContext.Provider value={{ imageFormOpenState, setImageFormOpen }}>{children}</EditorContext.Provider>
}
