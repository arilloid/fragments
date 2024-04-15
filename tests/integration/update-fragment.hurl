# tests/integration/update-fragment.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`Testing fragment`

# We expect to get back an HTTP 201
HTTP/1.1 201
[Captures]
url: header "Location"

# Authenticated PUT request
PUT {{url}}
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`Updated testing fragment`

# We expect to get back an HTTP 200
HTTP/1.1 200

# GET the updated fragment data
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns expected response
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
`Updated testing fragment`


