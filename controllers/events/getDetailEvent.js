const { Event, Ticket, Location } = require('../../models')
const { detailStatus, convertRupiah, convertDateToString } = require('../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { event_id } = req.params
    const findData = await Event.findOne({
      where: {
        event_id
      },
      attributes: ['event_id', 'name', 'start_date', 'end_date', 'status'],
      include: [
        {
          model: Location,
          attributes: ['location_id', 'address', 'city', 'status']
        }, 
        {
          model: Ticket,
          attributes: ['ticket_id', 'type', 'price', 'quota', 'status']
        }
      ]
    })
    if (findData) {
      const { event_id, name, start_date, end_date, status, Location, Tickets } = findData
      const { location_id, address, city, status: location_status } = Location
      Tickets.forEach(ticket => {
        ticket.status = detailStatus(ticket.status)
        ticket.price = convertRupiah(ticket.price)
      })
      const result = {
        event_id,
        name,
        start_date: convertDateToString(start_date),
        end_date: convertDateToString(end_date),
        status: detailStatus(status),
        Location: {
          location_id,
          address,
          city,
          status: detailStatus(location_status)
        },
        Tickets
      }
      res.status(200).json(result)
    } else throw {
      status: 404,
      message: `Data Event Not Found !`
    }
  } catch (err) {
    next(err)
  }
}