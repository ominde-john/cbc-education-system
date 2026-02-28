# School Registration API Fixes - TODO List

## Status: In Progress

### Completed:
- [ ] None yet

### In Progress:
- [ ] 1. Fix Backend Controller (schoolRegistration.controller.js)
- [ ] 2. Update Backend Validator (school.validator.js)
- [ ] 3. Fix Frontend Payload (index.tsx)

---

## Details:

### 1. Backend Controller Fix
- Map `school_email` → `email` for school contact
- Add handling for `national_id`/`passport_number` fields
- Add `appointment_date` handling (use current date if not provided)
- Add `role` field handling
- Add `username` handling

### 2. Backend Validator Update
- Add `school_email` field mapping
- Make `confirm_password` optional for API
- Add `role`, `national_id`, `passport_number`, `username` fields

### 3. Frontend Payload Fix
- Change `school_email` to `email`
- Add missing fields: `role`, `national_id`, `passport_number`, `username`, `appointment_date`
