import { useEffect, useState } from 'react'

export default function useLazyRender(elementRef: React.MutableRefObject<HTMLElement>, rootElementRef?: React.MutableRefObject<HTMLElement>) {
   const [isVisible, setIsVisible] = useState(false)

   useEffect(() => {
      if (elementRef.current) {
         const observer = new IntersectionObserver(
            (entries, observer) => {
               entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                     setIsVisible(true)
                     observer.unobserve(elementRef.current)
                  }
               })
            },
            {
               root: rootElementRef?.current ?? null,
               rootMargin: '0px 0px 0px 0px', // breakpoint start to view
               threshold: 0 // space to view
            }
         )
         observer.observe(elementRef.current)
      }
   }, [elementRef])

   return isVisible
}
