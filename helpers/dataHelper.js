const detailStatus = (status) => {
  switch (status) {
    case '0' : return 'deleted'
    case '1' : return 'created'
    case '2' : return 'suspend'
  }
  return 'created'
}

const checkTypeTicket = (typeTicket) => {
  const types = ['Reguler','Silver','Gold','Platinum','VIP', 'VVIP']
  const checkType = types.find(type => type.toLowerCase() === typeTicket.toLowerCase())
  return checkType
}

const convertRupiah = (price) => {
  const numberString = price.toString()
  const sisa = numberString.length % 3
  var rupiah = numberString.substr(0, sisa)
  const ribuan = numberString.substr(sisa).match(/\d{3}/g)
  if (ribuan) {
    const separator = sisa ? "." : ""
    rupiah += separator + ribuan.join(".")
  }
  return rupiah
}

module.exports = {
  detailStatus,
  checkTypeTicket,
  convertRupiah
}