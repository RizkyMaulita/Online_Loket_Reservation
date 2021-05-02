const { convertRupiah, detailStatus, convertDateToString } = require('../../helpers')
const { 
  Transaction, 
  Transaction_Detail, 
  Customer, 
  Ticket, 
  Event,
  Location
} = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { transaction_id } = req.params
    const findTransaction = await Transaction.findOne({
      where: {
        transaction_id
      },
      attributes: {
        exclude: ['create_by', 'create_date', 'update_by', 'update_date']
      },
      include: [
        {
          model: Transaction_Detail,
          attributes: {
            exclude: ['create_by', 'create_date', 'update_by', 'update_date']
          },
          include: {
            model: Ticket,
            attributes: {
              exclude: ['create_by', 'create_date', 'update_by', 'update_date']
            }
          }  
        },
        {
          model: Event,
          attributes: {
            exclude: ['create_by', 'create_date', 'update_by', 'update_date']
          },
          include: {
            model: Location,
            attributes: {
              exclude: ['create_by', 'create_date', 'update_by', 'update_date']
            },
          }
        },
        {
          model: Customer,
          attributes: {
            exclude: ['create_by', 'create_date', 'update_by', 'update_date']
          }
        }
      ]
    })
    if (findTransaction) {
      const { transaction_id, event_id, customer_id, total_price, total_ticket, status, Transaction_Details, Event, Customer } = findTransaction
      const { name, description, start_date, end_date, Location } = Event
      Transaction_Details.forEach(detailTransaction => {
        detailTransaction.status = detailStatus(detailTransaction.status)
        detailTransaction.total_price = convertRupiah(detailTransaction.total_price)
        if (detailTransaction.Ticket) {
          detailTransaction.Ticket.price = convertRupiah(detailTransaction.Ticket.price)
          detailTransaction.Ticket.status = detailStatus(detailTransaction.Ticket.status)
        }
      })
      const result = {
        transaction_id,
        event_id,
        customer_id,
        total_price: convertRupiah(total_price),
        total_ticket,
        status: detailStatus(status),
        Event: {
          event_id,
          name,
          description,
          start_date: convertDateToString(start_date),
          end_date: convertDateToString(end_date),
          status: detailStatus(Event.status),
          Location: {
            location_id: Location.location_id,
            address: Location.address,
            city: Location.city,
            status: detailStatus(Location.status)
          }
        },
        Customer: {
          customer_id,
          name: Customer.name,
          email: Customer.email,
          no_handphone: Customer.no_handphone,
          status: detailStatus(Customer.status)
        },
        Transaction_Details
      }
      res.status(200).json(result)
    } else throw {
      status: 404,
      message: `Data Transaction Not Found !`
    }
  } catch (err) {
    next(err)
  }
}