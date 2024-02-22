import { calculatePaginationRange } from '@/components/ui/@custom/pagination'
import { describe, expect, it } from 'vitest'

// Should return an array of length 3 when currentPage is 2 and totalPages is 3

describe('calculatePaginationRange', () => {
   // Returns an array of length 5 when currentPage is 3 and totalPages is 5
   it('should return an array of length 5 when currentPage is 3 and totalPages is 5', () => {
      const currentPage = 3
      const totalPages = 5
      const result = calculatePaginationRange(currentPage, totalPages)
      expect(result).toHaveLength(5)
   })

   // Returns an array of length 3 when currentPage is 1 and totalPages is 3
   it('should return an array of length 3 when currentPage is 1 and totalPages is 3', () => {
      const currentPage = 1
      const totalPages = 3
      const result = calculatePaginationRange(currentPage, totalPages)
      expect(result).toHaveLength(3)
   })

   // Returns an empty array when totalPages is 0
   it('should return an empty array when totalPages is 0', () => {
      const currentPage = 3
      const totalPages = 0
      const result = calculatePaginationRange(currentPage, totalPages)
      expect(result).toEqual([])
   })

   // Returns an array of length 1 when currentPage is 1 and totalPages is 1
   it('should return an array of length 1 when currentPage is 1 and totalPages is 1', () => {
      const currentPage = 1
      const totalPages = 1
      const result = calculatePaginationRange(currentPage, totalPages)
      expect(result).toHaveLength(1)
   })

   // Returns an array of length 5 when currentPage is 5 and totalPages is 5
   it('should return an array of length 5 when currentPage is 5 and totalPages is 5', () => {
      const currentPage = 5
      const totalPages = 5
      const result = calculatePaginationRange(currentPage, totalPages)
      expect(result).toHaveLength(5)
   })
})
