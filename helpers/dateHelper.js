const now = new Date()

const getCurrentDate = () => {
  const dateUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return dateUTC
}

const dateComparisonFromNow = (operator = '<', endDate = new Date()) => {
  let flag = false
  const endDateUTC = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000)
  switch (operator) {
    case '>': flag = getCurrentDate() > endDateUTC ; break
    default : flag = getCurrentDate() < endDateUTC
  }
  if (flag) return true
  return false
}

const convertDateToString = (dateString) => {
  const date = new Date(dateString)
  return date.toUTCString()
}

module.exports = {
  getCurrentDate,
  dateComparisonFromNow,
  convertDateToString
}