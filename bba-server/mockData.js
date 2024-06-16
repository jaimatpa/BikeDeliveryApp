const MOCK_DATA_TWILIO = [
    {
        "sid": "SM1234567890",
        "accountSid": "AC9876543210",
        "dateCreated": "2023-06-01T10:15:30Z",
        "dateUpdated": "2023-06-01T10:15:30Z",
        "dateSent": "2023-06-01T10:15:30Z",
        "direction": "outbound",
        "from": "+1234567890",
        "to": "+9876543210",
        "body": "Hello, how are you?"
    },
    {
        "sid": "SM2345678901",
        "accountSid": "AC8765432109",
        "dateCreated": "2023-06-02T15:30:45Z",
        "dateUpdated": "2023-06-02T15:30:45Z",
        "dateSent": "2023-06-02T15:30:45Z",
        "direction": "inbound",
        "from": "+9876543210",
        "to": "+1234567890",
        "body": "I'm doing great, thank you!"
    },
    {
        "sid": "SM3456789012",
        "accountSid": "AC7654321098",
        "dateCreated": "2023-06-03T09:45:15Z",
        "dateUpdated": "2023-06-03T09:45:15Z",
        "dateSent": "2023-06-03T09:45:15Z",
        "direction": "outbound",
        "from": "+1234567890",
        "to": "+3308190838",
        "body": "Are you available for a call later?"
    }
];


module.exports = { MOCK_DATA_TWILIO };