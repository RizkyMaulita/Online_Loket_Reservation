const { 
  Transaction, 
  Transaction_Detail, 
  Customer, 
  Ticket, 
  Event,
  Location, 
  sequelize 
} = require('../../models')
const { v4: uuidV4 } = require('uuid')
const { getCurrentDate } = require('../../helpers')

module.exports = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { event_id } = req.params
    const { data_customer, data_ticket, create_by } = req.body
    if (!data_customer || !data_ticket) {
      throw {
        status: 400,
        message: `Request body must be include 'data_customer' and 'data_ticket' !`
      }
    } else if (!data_ticket.length) {
      throw {
        status: 400,
        message: `Data ticket can't be empty ! At least 1 data with detail included type and quantity of ticket !`
      }
    } else {
      const { name, email, no_handphone } = data_customer
      if (!name || !email || !no_handphone) {
        throw {
          status: 400,
          message: `Data customer must be include 'name', 'email', and 'no_handphone' !`
        }
      } else {
        const checkEvent = await Event.findOne({
          where: { 
            event_id,
            status: '1' 
          },
          attributes: ['event_id'],
          include: {
            model: Location,
            attributes: ['location_id', 'status']
          }
        })
        if (checkEvent) {
          if (checkEvent.Location) {
            if (checkEvent.Location.status !== '1') {
              throw {
                status: 400,
                message: `Sorry, location for this event has not available ! Please change 'status' in data 'Locations' to '1' if location event is avalaible !`
              }
            } else {
              let customer_id = ''
              const checkDataCustomer = await Customer.findOne({
                where: {
                  name,
                  email,
                  no_handphone
                },
                attributes: ['customer_id']
              })
              if (checkDataCustomer) {
                customer_id = checkDataCustomer.customer_id
              } else {
                const createDataCustomer = await Customer.create({
                  name,
                  email,
                  no_handphone
                })
                if (createDataCustomer) {
                  customer_id = createDataCustomer.customer_id
                } else throw {
                  status: 400,
                  message: `Failed to create data customer !`
                }
              }
              if (customer_id) {
                const findDataTicket = await Ticket.findAll({
                  where: { 
                    event_id,
                    status: '1'
                  },
                  attributes: ['ticket_id', 'type', 'price', 'quota']
                })
                if (findDataTicket && findDataTicket.length) {
                  const requestTicket = {}
                  data_ticket.forEach(ticket => {
                    if (!requestTicket[ticket.type]) {
                      requestTicket[ticket.type] = 0
                    }
                    requestTicket[ticket.type] += +ticket.quantity
                  })
                  const notAvailableTickets = []
                  const transaction_id = uuidV4()
                  let total_price = 0
                  let total_ticket = 0
                  const arrUpdateTickets = []
                  const arrPayloadCreateTransactionDetails = []
                  for ( const key in requestTicket ) {
                    const checkTicket = findDataTicket.find(ticket => ticket.type.toLowerCase() === key.toLowerCase())
                    if (checkTicket) {
                      const isAvailableQuota = requestTicket[key] <= checkTicket.quota ? true : false
                      if (!isAvailableQuota) {
                        notAvailableTickets.push(key)
                      } else {
                        total_ticket += requestTicket[key]
                        total_price += (checkTicket.price * requestTicket[key])
                        const payloadUpdateTicket = {
                          quota: checkTicket.quota - requestTicket[key],
                          update_by: create_by ? create_by : 'admin',
                          update_date: getCurrentDate()
                        }
                        const payloadTransactionDetail = {
                          transaction_id,
                          transaction_detail_id: uuidV4(),
                          ticket_id: checkTicket.ticket_id,
                          quantity: requestTicket[key],
                          total_price: checkTicket.price * requestTicket[key],
                          create_by: create_by ? create_by : 'admin',
                          status: '1',
                          create_date: getCurrentDate()
                        }
                        arrUpdateTickets.push(Ticket.update(payloadUpdateTicket, { 
                          where: { 
                            ticket_id: checkTicket.ticket_id
                          },
                          returning: true,
                          transaction: t 
                        }))
                        arrPayloadCreateTransactionDetails.push(payloadTransactionDetail)
                      }
                    } else {
                      notAvailableTickets.push(key)
                    }
                  }
                  if (notAvailableTickets.length) {
                    throw {
                      status: 400,
                      message: `Sorry, Ticket for type ${notAvailableTickets.join(' , ')} is not avalaible !`
                    }
                  } else {
                    const payloadTransaction = {
                      transaction_id,
                      event_id,
                      customer_id,
                      total_price,
                      total_ticket
                    }
                    const arrPromises = [
                      Promise.all(arrUpdateTickets),
                      Transaction.create(payloadTransaction, { 
                        transaction: t
                      }),
                      Transaction_Detail.bulkCreate(arrPayloadCreateTransactionDetails, {
                        transaction: t
                      })
                    ]
                    const createNewPurchaseAndUpdateTicket = await Promise.all(arrPromises) 
                    if (createNewPurchaseAndUpdateTicket) {
                      const updateTicket = createNewPurchaseAndUpdateTicket[0]
                      const dataTransaction = createNewPurchaseAndUpdateTicket[1]
                      const dataTransactionDetail = createNewPurchaseAndUpdateTicket[2]
                      if (updateTicket && dataTransaction && dataTransactionDetail) {
                        let checkFailed = false
                        for (let i = 0; i < updateTicket.length; i++) {
                          if (!updateTicket[i][0] || !dataTransactionDetail[i]) {
                            checkFailed = true
                            throw {
                              name: 'Transaction Failed'
                            }
                          }
                          if (checkFailed) break
                        }
                        await t.commit()
                        res.status(201).json({
                          message: `Successfully create data transaction !`,
                          data: {
                            transaction_id,
                            event_id,
                            total_ticket,
                            total_price
                          }
                        })
                      } else throw {
                        name: 'Transaction Failed'
                      }
                    } 
                  }
                } else throw {
                  status: 404,
                  message: `Data Ticket Not Found !`
                }
              }
            }
          }
        } else throw {
          status: 404,
          message: `Data Event Not Found !`
        }
      }
    }
  } catch (err) {
    if (err.name === 'Transaction Failed') {
      await t.rollback()
      next({
        status: 400,
        message: `Failed to create data transaction !`
      })
    } else if (err.name === 'SequelizeValidationError') {
      next({
        name: 'Validation Error',
        status: 400,
        message: err.errors
      })
    } else next (err)
  }
}