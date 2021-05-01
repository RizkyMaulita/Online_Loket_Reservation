const now = new Date()

const getCurrentDate = () => {
  const dateUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return dateUTC
}

module.exports = {
  getCurrentDate
}