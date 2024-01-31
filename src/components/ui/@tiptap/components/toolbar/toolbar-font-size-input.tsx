import { Box, Button, Icon, Input } from '@/components/ui'
import { Editor } from '@tiptap/react'
import React, { useMemo } from 'react'

type FontSizeInputProps = {
   editor: Editor
}

const FONT_SIZE_MIN = 14
const FONT_SIZE_DEFAULT = 16
const FONT_SIZE_MAX = 96

const extractFontSizeValue = (attributes: Record<string, any>) => {
   const fontSize = attributes?.fontSize
   if (!fontSize) return FONT_SIZE_DEFAULT
   return Number(fontSize.replace('px', ''))
}

const FontSizeInput: React.FC<FontSizeInputProps> = ({ editor }) => {
   const currentFontSize = useMemo(() => {
      return extractFontSizeValue(editor.getAttributes('textStyle'))
   }, [editor.getAttributes('textStyle')])

   const handleChangeFontSize = (step: number) => {
      if (currentFontSize + step < FONT_SIZE_MIN) {
         editor.commands.setFontSize(FONT_SIZE_MIN)
      } else if (currentFontSize + step > FONT_SIZE_MAX) {
         editor.commands.setFontSize(FONT_SIZE_MAX)
      } else {
         editor.commands.setFontSize(currentFontSize + step)
      }
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (true) {
         case +e.target.value < FONT_SIZE_MIN:
            editor.commands.setFontSize(FONT_SIZE_MIN)
            break
         case +e.target.value > FONT_SIZE_MAX:
            editor.commands.setFontSize(FONT_SIZE_MAX)
            break
         default:
            editor.commands.setFontSize(+e.target.value)
            break
      }
   }

   return (
      <Box className='flex max-h-8 items-center justify-center rounded-lg border p-1'>
         <Button type='button' size='icon' variant='ghost' className='aspect-square h-6 w-6 self-center' onClick={() => handleChangeFontSize(-1)}>
            <Icon name='Minus' size={14} />
         </Button>
         <Input
            type='number'
            className='focus:boder-none h-8 w-12 border-l border-r border-none text-center outline-none'
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            value={currentFontSize}
            onChange={handleInputChange}
         />
         <Button type='button' size='icon' variant='ghost' className='aspect-square h-6 w-6 self-center' onClick={() => handleChangeFontSize(1)}>
            <Icon name='Plus' size={14} />
         </Button>
      </Box>
   )
}

export default FontSizeInput
