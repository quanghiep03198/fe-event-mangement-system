const Regex = {
   phone: /^\d{10}$/,
   email: /(\w+)@(gmail\.com|fpt\.edu\.vn)$/,
   time: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
   password: /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/
}
export default Regex
