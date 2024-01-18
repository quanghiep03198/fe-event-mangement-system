export const createFormData = (formValue: Record<string, any>) => {
   const formData = new FormData()
   Object.entries(formValue).forEach(([key, value]) => {
      formData.append(key, value)
   })
   return formData
}
