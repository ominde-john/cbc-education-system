# Test Backend APIs

## 1. Login (super_admin with school_id)
```
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "email": "codemaster@gmail.com",
  "password": "Admin123!"
}
```
**Expected:** accessToken with schoolId "613e3332-1174-450f-b769-be0fae88c20d"

## 2. Invite Teacher
```
POST http://localhost:3001/api/v1/teachers/invite
Authorization: Bearer [accessToken from step 1]
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "teacher@example.com"
}
```
**Expected:** Success - creates user + teacher.

## 3. List Teachers
```
GET http://localhost:3001/api/v1/teachers
Authorization: Bearer [accessToken]
```
**Expected:** Paginated teachers list for school.

## Available school_ids (run `select id from schools`):
- 613e3332-1174-450f-b769-be0fae88c20d (Codemaster)
- 58e1d745-74a9-4914-ade2-16a6427aadc9 (Codemaster Academy)

**Backend stable - test above!**
