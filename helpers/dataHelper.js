const detailStatus = (status) => {
  switch (status) {
    case '0' : return 'deleted'
    case '1' : return 'created'
    case '2' : return 'blocked'
  }
  return 'created'
}

module.exports = {
  detailStatus
}