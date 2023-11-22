# Atlas-Payfac

Atlas-Payfac is a middleware API that connects consumers to a payment facilitation service. It provides three intake
channels for processing different types of transactions: merchant processing, customer processing, and payment
processing.

# API Architecture

In an API project following the controller and service layer architecture, the primary role of the controller class is
to handle incoming HTTP requests and coordinate the execution flow of the application. It acts as an intermediary
between the client making the request and the underlying services responsible for processing the request. The service
class layer, on the other hand, is responsible for implementing the core business logic and data manipulation tasks. It
focuses on processing the data received from the controller and providing the necessary operations and functionality.

### Key Responsibilities of the Controller Class:

- **Request Handling**: The controller receives HTTP requests and determines the appropriate action based on the request
  method and endpoint.
- **Input Validation**: It validates the incoming request data to ensure it meets the required format and constraints.
- **Data Extraction**: The controller extracts relevant data from the request and prepares it for processing by the
  service layer.
- **Orchestration**: The controller acts as an orchestration piece and directs the lifecycle to the appropriate service
  class based on the transaction type. It determines the desired operation on the transaction type and invokes the
  appropriate function/method from the corresponding service class.
- **Invoking Services**: It interacts with the service layer by invoking the appropriate service methods and passing the
  extracted data.
- **Response Generation**: After the service layer completes its processing, the controller constructs an appropriate
  HTTP response to send back to the client.
- **Error Handling**: The controller catches and handles any exceptions or errors that occur during the request
  processing, transforming them into appropriate error responses.

### Key Responsibilities of the Service Class Layer:

- **Business Logic**: The service class layer encapsulates the business logic and rules specific to the application
  domain. It performs computations, validations, data transformations, and any other operations necessary to fulfill the
  business requirements.
- **Data Manipulation**: It interacts with the data access layer (e.g., database or external APIs) to retrieve, update,
  and persist data as required by the application logic.
- **Service Coordination**: The service layer coordinates multiple service methods or operations to achieve complex
  tasks. It may invoke other service methods, perform data aggregation, or handle transaction management.
- **Error Handling**: The service class layer handles exceptions or errors that occur during the processing of business
  logic. It ensures proper error handling and communicates the errors back to the controller layer for appropriate
  response generation.
- **Request Creation and Communication**: The service layer is responsible for taking the extracted data from the
  controller and creating the request for communication with external APIs, such as the Tilled payment-facilitator API.
  It prepares the request payload, handles authentication or authorization, sends the request, and manages the
  communication process.

Following this architecture helps in separating concerns, enhancing code organization, and promoting testability and
maintainability within your API project.

## Request Format

Incoming JSON requests should follow the following format:

```json
{
  "sourceId": "ATLAS_SMS",
  "transactionType": "CUSTOMER_TRANSACTION",
  "transactionOperation": "CREATE",
  "merchantId": "acct_aPQqTi4bux4hLjjqVWWkD",
  "customerId": "cus_nXCwwc0WefwGySicjO209",
  "referenceIds": {
    "chargeId": "",
    "checkoutSessionId": "",
    "disputeId": "",
    "merchantAppId": "",
    "paymentIntentId": "",
    "paymentMethodId": "",
    "refundId": "",
    "subscriptionId": ""
  },
  "authorization": {
    "payFac-token": "asdf123",
    "tilled-token": "qwerty789"
  },
  "transactionInfo": {
    "customerTrx": {
      "metadata": {
        "order_id": "100123",
        "internal_customer_id": "7cb1159d-875e-47ae-a309-319fa7ff395b"
      },
      "first_name": "Alex",
      "middle_name": "",
      "last_name": "Test 1",
      "email": "test123@test.com",
      "phone": "1234561234"
    }
  }
}

```

## Root Object

The root object should contain the following properties:

- `sourceId`: Identifies the source of the request (e.g., "WEB").
- `transactionType`: Indicates the type of transaction to be processed.
- `transactionOperation`: Specifies the operation to be performed on the transaction.
- `merchantId`: ID of the merchant associated with the request.
- `customerId`: ID of the customer, which is a child of the merchant.
- `referenceIds`: Contains relevant identification data specific to the transaction type.
- `authorization`: Contains authorization data for accessing the API.
- `transactionInfo`: Contains the transaction details. The nested object should have a name that reflects the
  transaction type appended with "Trx" (e.g., "paymentIntentTrx").

## Transaction Types and Operations

The `transactionType` and `transactionOperation` properties determine the type of transaction and the operation to be
performed. Operations can include basic CRUD operations (Create, Update, Delete) as well as Get, Get all, Cancel,
Resume, Pause, Retry, Confirm, Attach, Detach, and Expire.

| OperationTypes |                         |
|----------------|-------------------------|
| 1. `GET`       | 12. `CONFIRM`           | 
| 2. `GET_ALL`   | 13. `ATTACH`            |
| 3. `UPDATE`    | 14. `DETACH`            |
| 4. `DELETE`    | 15. `EXPIRE`            |
| 5. `CREATE`    | 16. `CAPABILITY_ADD`    |
| 6. `CANCEL`    | 17. `CAPABILITY_DELETE` |
| 7. `RESUME`    | 18. `CAPABILITY_UPDATE` |
| 8. `PAUSE`     | 19. `CONNECTED_UPDATE`  |
| 9. `RETRY`     | 20. `CONNECTED_CREATE`  |
| 10. `CAPTURE`  | 21. `CONNECTED_DELETE`  |
| 11. `ADD`      | ----------------------- |

## Supported transaction Types

| Payment Transactions           | Merchant Transactions       | Customer Transactions |
|--------------------------------|-----------------------------|-----------------------|
| 1. `paymentIntentTrx`          | 1. `merchantApplicationTrx` | 1. `customerTrx`      |
| 2. `paymentMethodTrx`          | 2. `accountsTrx`            |                       |
| 3. `checkoutSessionRequestTrx` | 3. `pricingTemplateTrx`     |                       |
| 4. `refundTrx`                 |                             |                       |
| 5. `subscriptionServiceTrx`    |                             |                       |
| 6. `disputeTrx`                |                             |                       |
| 7. `cancellationReasonTrx`     |                             |                       |
| 8. `subscriptionTrx`           |                             |                       |
| 9. `resumeAtDateTrx`           |                             |                       |
| 10. `nextPaymentDateTrx`       |                             |                       |

## Headers

To access the services of this API, you need to provide a JWT (JSON Web Token) that is generated by the authentication
endpoint. This JWT is specifically created for submitters who possess a valid Submitter Access ID. The Submitter Access
ID is a secret ID assigned by Atlas Labs to individual submitters, granting them access to the API.

When making a request for the JWT, make sure to include the Submitter Access ID in the headers using the key-value pair:
access_id: MYID001.

## License

Atlas-Payfac is released under the [MIT License](LICENSE.md).

#### Author: [Alex Mourtos](https://github.com/amourtos)

#### Contributors: