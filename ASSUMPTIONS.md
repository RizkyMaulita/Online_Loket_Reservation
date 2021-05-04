# Online Loket Reservation Application Assumption

1. column 'status' in each table indicates whether the data is active or not. If want to use the data, make sure status = '1' alias data is active/created. if status = '0', it means data has been deleted and if status = '2', it means data has been suspend / pending. And this column be one of validator for each endpoint.

2. Before making a purchase, it will be validated first that event has not started and location event is available.