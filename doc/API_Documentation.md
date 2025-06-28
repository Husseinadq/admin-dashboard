# NotificationsService API Documentation

This documentation provides comprehensive details about the NotificationsService API endpoints for the Trameaz AI Backend application.

## Base URL
```
/api/v1
```

## Authentication
All endpoints require proper authentication. Include your API token in the Authorization header:
```
Authorization: Bearer {your-api-token}
```

---

## Notification Templates

### 1. Get All Templates

**Purpose**: Retrieve all notification templates

**HTTP Method & URL**: `GET /api/v1/templates`

**Request Details**: No parameters required

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/templates" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "owner_id": "merchant_123",
      "name": "Welcome Email",
      "type": "email",
      "content": "Welcome to our platform!",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get Single Template

**Purpose**: Retrieve a specific notification template by ID

**HTTP Method & URL**: `GET /api/v1/templates/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template ID

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/templates/1" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "owner_id": "merchant_123",
    "name": "Welcome Email",
    "type": "email",
    "content": "Welcome to our platform!",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Create Template

**Purpose**: Create a new notification template

**HTTP Method & URL**: `POST /api/v1/templates`

**Request Details**:
- **JSON Body Fields**:
  - `owner_id` (string, required): Owner identifier
  - `name` (string, required, max 255 chars): Template name
  - `type` (string, required): Template type (email, sms, whatsapp)
  - `content` (string, required): Template content

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/templates" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "merchant_123",
    "name": "Order Confirmation",
    "type": "email",
    "content": "Your order has been confirmed!"
  }'
```

**Example Success Response**:
```json
{
  "status": 201,
  "data": {
    "id": 2,
    "owner_id": "merchant_123",
    "name": "Order Confirmation",
    "type": "email",
    "content": "Your order has been confirmed!",
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

### 4. Update Template

**Purpose**: Update an existing notification template

**HTTP Method & URL**: `PUT /api/v1/templates/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template ID
- **JSON Body Fields**:
  - `owner_id` (string, required): Owner identifier
  - `name` (string, required, max 255 chars): Template name
  - `type` (string, required): Template type (email, sms, whatsapp)
  - `content` (string, required): Template content

**Example Request**:
```bash
curl -X PUT "https://eejaz-api.trameaz.com/api/v1/templates/2" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "owner_id": "merchant_123",
    "name": "Order Confirmation Updated",
    "type": "email",
    "content": "Your order has been confirmed and is being processed!"
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": {
    "id": 2,
    "owner_id": "merchant_123",
    "name": "Order Confirmation Updated",
    "type": "email",
    "content": "Your order has been confirmed and is being processed!",
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

### 5. Delete Template

**Purpose**: Delete a notification template

**HTTP Method & URL**: `DELETE /api/v1/templates/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template ID

**Example Request**:
```bash
curl -X DELETE "https://eejaz-api.trameaz.com/api/v1/templates/2" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "Template deleted successfully"
}
```

---

## Template Attributes

### 1. Get All Template Attributes

**Purpose**: Retrieve all template attributes

**HTTP Method & URL**: `GET /api/v1/templates/attributes`

**Request Details**: No parameters required

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/templates/attributes" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "template_id": 1,
      "name": "customer_name",
      "type": "string",
      "value": "John Doe",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Get Single Template Attribute

**Purpose**: Retrieve a specific template attribute by ID

**HTTP Method & URL**: `GET /api/v1/templates/attributes/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template attribute ID

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/templates/attributes/1" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "template_id": 1,
    "name": "customer_name",
    "type": "string",
    "value": "John Doe",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Get Template Attributes by Template ID

**Purpose**: Retrieve all attributes for a specific template

**HTTP Method & URL**: `GET /api/v1/templates/attributes/template/{templateId}`

**Request Details**:
- **Path Parameters**:
  - `templateId` (integer, required): Template ID

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/templates/attributes/template/1" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "template_id": 1,
      "name": "customer_name",
      "type": "string",
      "value": "John Doe"
    },
    {
      "id": 2,
      "template_id": 1,
      "name": "order_number",
      "type": "string",
      "value": "ORD-12345"
    }
  ]
}
```

### 4. Create Template Attribute

**Purpose**: Create a new template attribute

**HTTP Method & URL**: `POST /api/v1/templates/attributes`

**Request Details**:
- **JSON Body Fields**:
  - `template_id` (integer, required): Template ID
  - `name` (string, required, max 255 chars): Attribute name
  - `type` (string, required, max 255 chars): Attribute type
  - `value` (string, optional, max 255 chars): Attribute value

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/templates/attributes" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": 1,
    "name": "product_name",
    "type": "string",
    "value": "Premium Widget"
  }'
```

**Example Success Response**:
```json
{
  "status": 201,
  "data": {
    "id": 3,
    "template_id": 1,
    "name": "product_name",
    "type": "string",
    "value": "Premium Widget",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  }
}
```

### 5. Update Template Attribute

**Purpose**: Update an existing template attribute

**HTTP Method & URL**: `PUT /api/v1/templates/attributes/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template attribute ID
- **JSON Body Fields**:
  - `name` (string, required, max 255 chars): Attribute name
  - `type` (string, required, max 255 chars): Attribute type
  - `value` (string, optional, max 255 chars): Attribute value

**Example Request**:
```bash
curl -X PUT "https://eejaz-api.trameaz.com/api/v1/templates/attributes/3" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "product_name_updated",
    "type": "string",
    "value": "Premium Widget Pro"
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": {
    "id": 3,
    "template_id": 1,
    "name": "product_name_updated",
    "type": "string",
    "value": "Premium Widget Pro",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
  }
}
```

### 6. Delete Template Attribute

**Purpose**: Delete a template attribute

**HTTP Method & URL**: `DELETE /api/v1/templates/attributes/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Template attribute ID

**Example Request**:
```bash
curl -X DELETE "https://eejaz-api.trameaz.com/api/v1/templates/attributes/3" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "Template attribute deleted successfully"
}
```

---

## SMS Notifications

### 1. Send Single SMS Message

**Purpose**: Send a single SMS message

**HTTP Method & URL**: `POST /api/v1/sms/send/message`

**Request Details**:
- **JSON Body Fields**: (Implementation pending - refer to controller for specific validation rules)

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/sms/send/message" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "message": "Your OTP is: 123456",
    "template_id": 1
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "SMS sent successfully"
}
```

### 2. Send Multiple SMS Messages

**Purpose**: Send multiple SMS messages in batch

**HTTP Method & URL**: `POST /api/v1/sms/send/messages`

**Request Details**:
- **JSON Body Fields**: (Implementation pending - refer to controller for specific validation rules)

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/sms/send/messages" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "phone_number": "+1234567890",
        "message": "Your order is ready!",
        "template_id": 1
      },
      {
        "phone_number": "+0987654321",
        "message": "Thank you for your purchase!",
        "template_id": 2
      }
    ]
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "SMS messages sent successfully"
}
```

---

## WhatsApp Notifications

### 1. Send Single WhatsApp Message

**Purpose**: Send a single WhatsApp message

**HTTP Method & URL**: `POST /api/v1/whatsapp/send/message`

**Request Details**:
- **JSON Body Fields**: (Implementation pending - refer to controller for specific validation rules)

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/whatsapp/send/message" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "message": "Your order has been shipped!",
    "template_id": 1
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "WhatsApp message sent successfully"
}
```

### 2. Send Multiple WhatsApp Messages

**Purpose**: Send multiple WhatsApp messages in batch

**HTTP Method & URL**: `POST /api/v1/whatsapp/send/messages`

**Request Details**:
- **JSON Body Fields**: (Implementation pending - refer to controller for specific validation rules)

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/whatsapp/send/messages" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "phone_number": "+1234567890",
        "message": "Your order is ready for pickup!",
        "template_id": 1
      },
      {
        "phone_number": "+0987654321",
        "message": "Thank you for choosing our service!",
        "template_id": 2
      }
    ]
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "WhatsApp messages sent successfully"
}
```

---

## Email Notifications

### 1. Send Single Email

**Purpose**: Send a single email message

**HTTP Method & URL**: `POST /api/v1/email/send/message`

**Request Details**:
- **JSON Body Fields**:
  - `sender` (string, required): Sender email address
  - `recipient` (string, required): Recipient email address
  - `subject` (string, required, max 255 chars): Email subject
  - `body` (string, required): Email body content
  - `attachments` (JSON, optional): Email attachments
  - `type` (string, required): Email type (otp, register, reset_password, other)
  - `template_attributes` (array, required): Template attributes for email rendering

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/email/send/message" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "noreply@trameaz.com",
    "recipient": "customer@example.com",
    "subject": "Welcome to Trameaz!",
    "body": "Thank you for joining our platform.",
    "type": "register",
    "template_attributes": {
      "customer_name": "John Doe",
      "activation_link": "https://trameaz.com/activate/abc123"
    }
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "Email sent successfully"
}
```

### 2. Send Multiple Emails

**Purpose**: Send multiple emails in batch

**HTTP Method & URL**: `POST /api/v1/email/send/messages`

**Request Details**:
- **JSON Body Fields**:
  - `messages` (array, required): Array of email objects
  - `messages[].sender` (string, required): Sender email address
  - `messages[].recipient` (string, required): Recipient email address
  - `messages[].subject` (string, required, max 255 chars): Email subject
  - `messages[].body` (string, required): Email body content
  - `messages[].attachments` (JSON, optional): Email attachments
  - `messages[].type` (string, required): Email type (otp, register, reset_password, other)
  - `messages[].template_attributes` (array, required): Template attributes

**Example Request**:
```bash
curl -X POST "https://eejaz-api.trameaz.com/api/v1/email/send/messages" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "sender": "noreply@trameaz.com",
        "recipient": "customer1@example.com",
        "subject": "Order Confirmation",
        "body": "Your order has been confirmed.",
        "type": "other",
        "template_attributes": {
          "order_number": "ORD-12345",
          "customer_name": "John Doe"
        }
      },
      {
        "sender": "noreply@trameaz.com",
        "recipient": "customer2@example.com",
        "subject": "Password Reset",
        "body": "Click the link to reset your password.",
        "type": "reset_password",
        "template_attributes": {
          "reset_link": "https://trameaz.com/reset/xyz789",
          "customer_name": "Jane Smith"
        }
      }
    ]
  }'
```

**Example Success Response**:
```json
{
  "status": 200,
  "message": "Emails sent successfully"
}
```

### 3. Get Single Email

**Purpose**: Retrieve a specific email by ID

**HTTP Method & URL**: `GET /api/v1/email/{id}`

**Request Details**:
- **Path Parameters**:
  - `id` (integer, required): Email ID

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/email/1" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "sender": "noreply@trameaz.com",
    "recipient": "customer@example.com",
    "subject": "Welcome to Trameaz!",
    "body": "Thank you for joining our platform.",
    "type": "register",
    "sent_at": "2024-01-15T10:30:00Z",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Get All Emails

**Purpose**: Retrieve all emails

**HTTP Method & URL**: `GET /api/v1/email`

**Request Details**: No parameters required

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/email" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "sender": "noreply@trameaz.com",
      "recipient": "customer@example.com",
      "subject": "Welcome to Trameaz!",
      "type": "register",
      "sent_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "sender": "noreply@trameaz.com",
      "recipient": "customer2@example.com",
      "subject": "Order Confirmation",
      "type": "other",
      "sent_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### 5. Get Emails by Sender

**Purpose**: Retrieve all emails sent by a specific sender

**HTTP Method & URL**: `GET /api/v1/email/sender/{sender}`

**Request Details**:
- **Path Parameters**:
  - `sender` (string, required): Sender email address

**Example Request**:
```bash
curl -X GET "https://eejaz-api.trameaz.com/api/v1/email/sender/noreply@trameaz.com" \
  -H "Authorization: Bearer {your-api-token}" \
  -H "Content-Type: application/json"
```

**Example Success Response**:
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "sender": "noreply@trameaz.com",
      "recipient": "customer@example.com",
      "subject": "Welcome to Trameaz!",
      "type": "register",
      "sent_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "sender": "noreply@trameaz.com",
      "recipient": "customer2@example.com",
      "subject": "Order Confirmation",
      "type": "other",
      "sent_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": 400,
  "error": "Validation failed",
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are subject to rate limiting:
- **Rate Limit**: 100 requests per minute per API key
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when rate limit resets

---

## Notes

1. **SMS and WhatsApp Controllers**: The SMS and WhatsApp controllers currently contain placeholder methods. Implementation details should be added when the actual functionality is developed.

2. **Template Attributes**: Template attributes are used for dynamic content replacement in notification templates.

3. **Email Types**: The system supports different email types (otp, register, reset_password, other) for categorization and processing.

4. **Batch Operations**: Both email, SMS, and WhatsApp services support batch operations for sending multiple messages efficiently.

5. **Error Handling**: All endpoints include comprehensive error handling with appropriate HTTP status codes and descriptive error messages.

---

## Support

For technical support or questions about the NotificationsService API, please contact the development team or refer to the project documentation.