import { convertBase64 } from '@/common/utils/convert-base64'
import { describe, expect, it } from 'vitest'

describe('convertBase64', () => {
   // Resolves with a base64 string when given a valid file
   it('should resolve with a base64 string when given a valid file', () => {
      const file = new File(['test'], 'test.txt')
      return convertBase64(file).then((result) => {
         expect(typeof result).toBe('string')
         expect(result).toMatch(/^data:image\/\w+;base64,/i)
      })
   })

   // Resolves with an ArrayBuffer when given a valid file
   it('should resolve with an ArrayBuffer when given a valid file', () => {
      const file = new File(['test'], 'test.txt')
      return convertBase64(file).then((result) => {
         expect(result instanceof ArrayBuffer).toBe(true)
      })
   })

   // Resolves with null when given an empty file
   it('should resolve with null when given an empty file', () => {
      const file = new File([], 'test.txt')
      return convertBase64(file).then((result) => {
         expect(result).toBeNull()
      })
   })

   // Resolves with null when given a null file
   it('should resolve with null when given a null file', () => {
      const file = null
      return convertBase64(file).then((result) => {
         expect(result).toBeNull()
      })
   })

   // Resolves with null when given an undefined file
   it('should resolve with null when given an undefined file', () => {
      const file = undefined
      return convertBase64(file).then((result) => {
         expect(result).toBeNull()
      })
   })

   // Resolves with null when given a non-existent file
   it('should resolve with null when given a non-existent file', () => {
      const file = new File(['test'], 'nonexistent.txt')
      return convertBase64(file).then((result) => {
         expect(result).toBeNull()
      })
   })
})
