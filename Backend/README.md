# CBE Education Backend API

## Authentication

**Login** `POST /api/v1/auth/login`
```
{
  "email": "codemaster@gmail.com",
  "password": "your_password"
}
```
Response contains `accessToken` & `user.schoolId`.

**Headers:** `Authorization: Bearer [accessToken]`

## Teachers API

**List** `GET /api/v1/teachers`
- school_admin/super_admin only
- Returns paginated teachers for user's school_id

**Invite** `POST /api/v1/teachers/invite`
```
{
  "school_id": "613e3332-1174-450f-b769-be0fae88c20d",
  "first_name": "John",
  "last_name": "Doe",
  "email": "teacher@test.com",
  "phone_number": "+254712345678",
  "tsc_number": "TSC123456",
  "qualifications": "BEd Science"
}
```

## Schools (from DB)

Use school_id: `613e3332-1174-450f-b769-be0fae88c20d` (Codemaster Academy)

**Super admin token works** - validation prevents crashes.

**Test:** Login → POST invite → Success!

