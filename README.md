# ONLINE LOKET RESERVATION

> Note:
> - This app running on Node.js and postgres, so make sure your local have installed Node.js (min. v12) and postgres v13. Or you can run this command 
``` psql --version ``` and  
``` node --version ```
> - This app use nodemon, so make sure your local have installed that. if not, you can run this command to install that
```
npm i -g nodemon
```
> - You can see schema database for this app in folder assets
#
## STEP Installation

1. Clone this repository in your local

2. Create file ```.env``` and copy paste file ```.env.example``` into it. Change value for ```DB_USERNAME_DEVELOPMENT, DB_PASSWORD_DEVELOPMENT, DB_USERNAME_TEST, DB_PASSWORD_DEVELOPMENT ``` according to your local postgres.

3. Default this app running on port 3000, so make sure there are not other server running on that port. Or you feel free to change value ```PORT``` in file .env.

4. run this command to install package and create database (with migration table) to your local
```
npm i && npm run db:create:dev && npm run db:migrate:dev
```
5. run this command to running app
```
npm run dev
```
#
## API Documentation

#### Base URL
```
  http://localhost:3000
```
### POST /location/create
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request body
```js
{
  "address": string,
  "city": string,
  "create_by": string
}
```
##### SUCCESS
- Response `(201)`
```js
{
  "message": "Successfully create new location !",
  "data": {
    "location_id": uuid,
    "address": string,
    "city": string,
    "create_by": string,
    "status": "1",
    "create_date": string,
    "update_by": null,
    "update_date": null
  }
}
```
##### ERROR `Bad Request`
- Response `(400)`
```js
{
  "messages": [
    {
      "message": string
    },
    ...
  ]
}
```
> or
```js
{
  "message": "Failed to create new location !"
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#
### POST /event/create
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request body
```js
{
  "location_id": uuid,
  "name": string,
  "description": string,
  "start_date": string of date,
  "end_date": string of date,
  "create_by": string
}
```
##### SUCCESS
- Response `(201)`
```js
{
  "message": "Successfully create new event !",
  "data": {
    "event": {
      "event_id": uuid,
      "location_id": uuid,
      "name": string,
      "description": string,
      "start_date": string of date,
      "end_date": string of date
    },
    "location": {
        "address": string,
        "city": string
    }
  }
}
```
#### ERROR `Data Not Found`
- Response `(404)`
```js
{
  "message": "Data Location Not Found !"
}
```
##### ERROR `Bad Request`
- Response `(400)`
```js
{
  "messages": [
    {
      "message": string
    },
    ...
  ]
}
```
> or
```js
{
  "message": "Failed to create new event !"
}
```
> or
```js
{
  "message": "Successfully create new event, but failed update data location !",
  "data": {
    "event": {
      "event_id": uuid,
      "location_id": uuid,
      "name": string,
      "description": string,
      "start_date": string of date,
      "end_date": string of date
    }
  }
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#
### POST /event/ticket/create
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request body
```js
{
  "event_id": uuid,
  "type": string,
  "price": integer,
  "quota": integer
}
```
> Note: for 'type' must be either 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' !
##### SUCCESS
- Response `(201)`
```js
{
  "message": "Successfully create new ticket !",
  "data": {
    "ticket": {
        "event_id": uuid,
        "ticket_id": uuid,
        "type": string,
        "price": integer,
        "quota": integer
    },
    "event": {
        "event_id": uuid,
        "name": string,
        "start_date": string of date,
        "end_date": string of date
    }
  }
}
```
> or
```js
{
  "message": "Successfully create new ticket and update data event !",
  "data": {
    "ticket": {
      "event_id": uuid,
      "ticket_id": uuid,
      "type": string,
      "price": integer,
      "quota": integer
    },
    "event": {
      "event_id": uuid,
      "name": string,
      "start_date": string of date,
      "end_date": strinf of date,
      "status": "created"
    }
  }
}
```
##### ERROR `Bad Request`
- Response `(400)`
```js
{
  "message": "Request body must be include 'event_id', 'type', 'price', and 'quota' !"
}
```
> or
```js
{
  "message": "Price and quota must be an integer !"
}
```
> or
```js
{
  "message": "Ticket type must be either 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' !"
}
```
> or
```js
{
  "message": "Failed to create ticket, because event is over !"
}
```
> or
```js
{
  "messages": [
    {
      "message": string
    },
    ...
  ]
}
```
> or
```js
{
  "message": "Failed to create new ticket !"
}
```
> or
```js
{
  "message": "Successfully create new ticket, but failed update data event !",
  "data": {
    "ticket": {
      "event_id": uuid,
      "ticket_id": uuid,
      "type": string,
      "price": integer,
      "quota": integer
    }
  }
}
```
##### ERROR `Data Not Found`
- Response `(404)`
```js
{
  "message": "Data Event Not Found !"
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#
### GET /event/get_info/:event_id
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request params
```js
  event_id = uuid
```
##### SUCCESS
- Response `(200)`
```js
{
  "event_id": uuid,
  "name": string,
  "description": string,
  "start_date": string of date,
  "end_date": string of date,
  "status": string,
  "Location": {
    "location_id": uuid,
    "address": string,
    "city": string,
    "status": string
  },
  "Tickets": [
    {
      "ticket_id": uuid,
      "type": string,
      "price": string,
      "quota": integer,
      "status": string
    },
    ...
  ]
}
```
> Note: for 'status' can be 'created', 'deleted', or 'suspend' !
##### ERROR `Data Not Found`
- Response `(404)`
```js
{
  "message": "Data Event Not Found !"
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#
### POST /transaction/purchase/:event_id
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request params
```js
  event_id = uuid
```
- Request body
```js
{
  "data_customer": {
    "name": string,
    "email": string,
    "no_handphone": string
  },
  "data_ticket": [
    {
      "type": string,
      "quantity": integer
    },
    ...
  ]
}
```
> Note: for 'type' must be either 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' !
##### SUCCESS 
- Response (201)
```js
{
  "message": "Successfully create data transaction !",
  "data": {
    "transaction_id": uuid,
    "event_id": uuid,
    "total_ticket": integer,
    "total_price": integer
  }
}
```
##### ERROR `Data Not Found`
- Response `(404)`
```js
{
  "message": "Data Event Not Found !"
}
```
> or
```js
{
  "message": "Data Ticket Not Found !"
}
```
##### ERROR `Bad Request`
- Response `(400)`
```js
{
  "message": "Request body must be include 'data_customer' and 'data_ticket' !"
}
```
> or
```js
{
  "message": "Data ticket can't be empty ! At least 1 data with detail included type and quantity of ticket !"
}
```
> or
```js
{
  "message": "Data customer must be include 'name', 'email', and 'no_handphone' !"
}
```
> or
```js
{
  "message": "Sorry, location for this event has not available ! Please change 'status' in data 'Locations' to '1' if location event is avalaible !"
}
```
> or
```js
{
  "message": "Sorry, Ticket for type [types] is not avalaible !"
}
```
> Note: for [types] can be 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' which dependeceis with type in request body !
> or
```js
{
  "message": "Failed to create data transaction !"
}
```
> or
```js
{
  "messages": [
    {
      "message": string
    },
    ...
  ]
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#
### GET /transaction/get_info/:transaction_id
- Request headers
```js
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```
- Request params
```js
  transaction_id = uuid
```
##### SUCCESS
- Response `(200)`
```js
{
  "transaction_id": uuid,
  "event_id": uuid,
  "customer_id": uuid,
  "total_price": string,
  "total_ticket": integer,
  "status": string,
  "Event": {
    "event_id": uuid,
    "name": string,
    "description": string,
    "start_date": string of date,
    "end_date": string of date,
    "status": string,
    "Location": {
      "location_id": string,
      "address": string,
      "city": string,
      "status": string
    }
  },
  "Customer": {
    "customer_id": uuid,
    "name": string,
    "email": string,
    "no_handphone": string,
    "status": string
  },
  "Transaction_Details": [
    {
      "transaction_detail_id": uuid,
      "transaction_id": uuid,
      "ticket_id": uuid,
      "quantity": integer,
      "total_price": string,
      "status": string,
      "Ticket": {
        "ticket_id": uuid,
        "event_id": uuid,
        "type": string,
        "price": string,
        "quota": integer,
        "status": string
      }
    },
    ...
  ]
}
```
> Note: 
- for 'type' can be 'Reguler','Silver','Gold','Platinum','VIP', or 'VVIP' !
- for 'status' can be 'created', 'deleted', or 'suspend' !
##### ERROR `Data Not Found`
- Response `(404)`
```js
{
  "message": "Data Transaction Not Found !"
}
```
##### ERROR `Internal Server Error`
- Response `(500)`
```js
{
  "message": "Internal Server Error"
}
```
#