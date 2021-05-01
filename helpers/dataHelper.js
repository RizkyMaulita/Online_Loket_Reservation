const detailStatus = (status) => {
  switch (status) {
    case '0' : return 'deleted'
    case '1' : return 'created'
    case '2' : return 'blocked'
  }
  return 'created'
}

const checkTypeTicket = (typeTicket) => {
  const types = ['Reguler','Silver','Gold','Platinum','VIP', 'VVIP']
  const checkType = types.find(type => type.toLowerCase() === typeTicket.toLowerCase())
  return checkType
}

module.exports = {
  detailStatus,
  checkTypeTicket
}