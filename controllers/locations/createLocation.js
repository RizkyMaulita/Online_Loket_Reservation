const { Location } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { address, city, create_by } = req.body
    if (!address || !city) {
      throw {
        status: 400,
        message: `Request body must be include 'address' and 'city' !`
      }
    } else {
      const payload = {
        address,
        city,
        create_by: create_by ? create_by : 'admin'
      }
      const createNewLocation = await Location.create(payload)
      if (createNewLocation) {
        res.status(201).json({
          message: `Successfully create new location !`,
          data: createNewLocation
        })
      } else throw {
        status: 400,
        message: `Failed to create new location !`
      }
    }
  } catch(err) {
    if (err.name === 'SequelizeValidationError') {
      next({
        name: 'Validation Error',
        status: 400,
        message: err.errors
      })
    } else next (err)
  }
}