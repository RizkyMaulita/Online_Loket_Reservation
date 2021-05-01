const { Event, Ticket, Location } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { event_id } = req.params
    const findData = await Event.findOne({
      where: {
        event_id,
        status: '1'
      },
      attributes: ['event_id', 'name', 'start_date', 'end_date'],
      include: [
        {
          model: Location,
          where: {
            status: '1'
          },
          attributes: ['location_id', 'address', 'city']
        }, 
        {
          model: Ticket,
          where: {
            status: '1'
          },
          attributes: ['ticket_id', 'type', 'price', 'quota']
        }
      ]
    })
    if (findData) {
      res.status(200).json(findData)
    } else throw {
      status: 404,
      message: `Data Event Not Found !`
    }
  } catch (err) {
    next(err)
  }
}