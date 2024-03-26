# tests/integration/404.hurl
GET http://localhost:8080/no-such-route

# We should get back an HTTP 404 response
HTTP/1.1 404

[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "code": 404 }
jsonpath "$.error.code" == 404
# We expect to get back a JSON response with { ..., "message": "not found" }
jsonpath "$.error.message" == "not found"