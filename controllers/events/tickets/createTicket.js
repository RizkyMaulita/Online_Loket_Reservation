const { checkTypeTicket, getCurrentDate, detailStatus, dateComparisonFromNow } = require('../../../helpers')
const { Event, Ticket } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { event_id, type, price, quota, create_by } = req.body
    if (!event_id || !type || !price || !quota) {
      throw {
        status: 400,
        message: `Request body must be include 'event_id', 'type', 'price', and 'quota' !`
      }
    } else if (!(+price) || !(+quota)) {
      throw {
        status: 400,
        message: `Price and quota must be an integer !`
      }
    } else if (!checkTypeTicket(type)) {
      throw {
        status: 400,
        message: `Ticket type must be either 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' !`
      }
    } else {
      const findEvent = await Event.findOne({
        where: { event_id },
        attributes: ['event_id', 'name', 'status', 'start_date', 'end_date']
      })
      if (findEvent) {
        if (!dateComparisonFromNow('<', new Date(findEvent.end_date))) {
          throw {
            status: 400,
            message: `Failed to create ticket, because event is over !`
          }
        } else {
          const payloadTicket = {
            event_id,
            type: checkTypeTicket(type),
            price: +price,
            quota: +quota, 
            create_by: create_by ? create_by : 'admin'
          }
          if (findEvent.status === '1') {
            const createTicket = await Ticket.create(payloadTicket)
            if (createTicket) {
              res.status(201).json({
                message: `Successfully create new ticket !`,
                data: {
                  ticket: {
                    event_id,
                    ticket_id: createTicket.ticket_id,
                    type: createTicket.type,
                    price: createTicket.price,
                    quota: createTicket.quota
                  },
                  event: {
                    event_id,
                    name: findEvent.name,
                    start_date: findEvent.start_date,
                    end_date: findEvent.end_date
                  }
                }
              })
            } else throw {
              status: 400,
              message: `Failed to create new ticket !`
            }
          } else {
            const payloadEvent = {
              status: '1',
              update_date: getCurrentDate(),
              update_by: create_by ? create_by : 'admin'
            }
            const arrPromises = [
              Ticket.create(payloadTicket),
              Event.update(payloadEvent, {
                where: { event_id },
                returning: true
              })
            ]
            const updateEventAndCreateTicket = await Promise.all(arrPromises)
            if (updateEventAndCreateTicket) {
              const updateEvent = updateEventAndCreateTicket[1]
              const createTicket = updateEventAndCreateTicket[0]
              if (createTicket && updateEvent) {
                res.status(201).json({
                  message: `Successfully create new ticket and update data event !`,
                  data: {
                    ticket: {
                      event_id,
                      ticket_id: createTicket.ticket_id,
                      type: createTicket.type,
                      price: createTicket.price,
                      quota: createTicket.quota
                    },
                    event: {
                      event_id,
                      name: updateEvent.name,
                      start_date: updateEvent.start_date,
                      end_date: updateEvent.end_date,
                      status: detailStatus(updateEvent.status)
                    }
                  }
                })
              } else if (createTicket) {
                res.status(400).json({
                  message: `Successfully create new ticket, but failed update data event !`,
                  data: {
                    ticket: {
                      event_id,
                      ticket_id: createTicket.ticket_id,
                      type: createTicket.type,
                      price: createTicket.price,
                      quota: createTicket.quota
                    },
                    event: {
                      event_id,
                      name: updateEvent.name,
                      start_date: updateEvent.start_date,
                      end_date: updateEvent.end_date,
                      status: detailStatus(updateEvent.status)
                    }
                  }
                })
              } else {
                throw {
                  status: 400,
                  message: `Failed to create new ticket !`
                }
              }
            }
          }
        }
      } else throw {
        status: 404,
        message: `Data Event Not Found !`
      }
    }
  } catch (err) {
    next(err)
  }
}