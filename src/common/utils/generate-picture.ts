const generatePicture = (name: string | undefined) => {
   name ??= 'A'
   return 'https://ui-avatars.com/api/?name=' + name
}

export default generatePicture
