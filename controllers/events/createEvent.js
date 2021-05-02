const { getCurrentDate, detailStatus } = require('../../helpers')
const { Location, Event } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { location_id, name, description, start_date, end_date, create_by } = req.body
    if (!location_id || !name || !start_date || !end_date) {
      throw {
        status: 400,
        message: `Request body must be include 'location_id', 'name', 'start_date', and 'end_date' !`
      }
    } else {
      const findLocation = await Location.findOne({
        where: {
          location_id
        },
        attributes: ['location_id', 'address', 'city', 'status']
      })
      if (findLocation) {
        const payloadEvent = {
          location_id,
          name,
          description: description ? description : null,
          start_date,
          end_date,
          create_by: create_by ? create_by : 'admin'
        }
        if (findLocation.status === '1') {
          const createEvent = await Event.create(payloadEvent)
          if (createEvent) {
            res.status(201).json({
              message: `Successfully create new event !`,
              data: {
                event: {
                  event_id: createEvent.event_id,
                  location_id,
                  name,
                  description: createEvent.description,
                  start_date,
                  end_date
                },
                location: {
                  address: findLocation.address,
                  city: findLocation.city
                }
              }
            })
          } else throw {
            status: 400,
            message: `Failed to create new event !`
          }
        } else {
          const payloadLocation = {
            status: '1',
            update_by: create_by ? create_by : 'admin',
            update_date: getCurrentDate()
          }
          const arrPromises = [
            Event.create(payloadEvent),
            Location.update(payloadLocation, {
              where: { location_id },
              returning: true
            })
          ]
          const updateLoctAndCreateEvent = await Promise.all(arrPromises)
          if (updateLoctAndCreateEvent) {
            const createEvent = updateLoctAndCreateEvent[0]
            const updateLocation = updateLoctAndCreateEvent[1][1][0]
            if (createEvent && updateLocation) {
              res.status(201).json({
                message: `Successfully create new event and update data location !`,
                data: {
                  event: {
                    event_id: createEvent.event_id,
                    name: createEvent.name,
                    description: createEvent.description,
                    start_date: createEvent.start_date,
                    end_date: createEvent.end_date
                  },
                  location: {
                    location_id,
                    address: updateLocation.address,
                    city: updateLocation.city,
                    status: detailStatus(updateLocation.status)
                  }
                },
                updateLocation
              })
            } else if (createEvent) {
              res.status(400).json({
                message: `Successfully create new event, but failed update data location !`,
                data: {
                  event: {
                    event_id: createEvent.event_id,
                    name: createEvent.name,
                    description: createEvent.description,
                    start_date: createEvent.start_date,
                    end_date: createEvent.end_date
                  }
                }
              })
            } else {
              throw {
                status: 400,
                message: `Failed to create new event !`
              }
            }
          }
        }
      } else throw {
        status: 404,
        message: `Data Location Not Found !`
      }
    }
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      next({
        name: 'Validation Error',
        status: 400,
        message: err.errors
      })
    } else next (err)
  }
}