# tests/integration/post-fragments-unsupported.hurl
# POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a fragment of unsupported type (image/png)
Content-Type: image/png
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# 1. We expect to get back an HTTP 400
HTTP/1.1 400

[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { ..., "code": 415 }
jsonpath "$.error.code" == 415
# We expect to get back a JSON response with { ..., "message": "Content-Type is not supported" }
jsonpath "$.error.message" == "Content-Type is not supported"