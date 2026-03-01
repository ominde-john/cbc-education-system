# Academic Terms API Testing Guide

## IMPORTANT: Restart Server
If you've just added the academic terms API, you MUST **restart/redeploy the server** for the new routes to be loaded.

## Prerequisites
1. Run the seed data SQL file: `Backend/migrations/seed_academic_terms.sql`
2. Get an authentication token by logging in
3. Replace `YOUR_AUTH_TOKEN` with your actual JWT token

## API Endpoints

### 1. GET All Terms for a School
```
bash
# Use port 3001 for local development
curl -X GET "http://localhost:3001/api/v1/academic-terms/school/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**With filters:**
```
bash
# Filter by year
curl -X GET "http://localhost:3001/api/v1/academic-terms/school/1?year=2024" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Filter by current
curl -X GET "http://localhost:3001/api/v1/academic-terms/school/1?is_current=true" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Filter by active status
curl -X GET "http://localhost:3001/api/v1/academic-terms/school/1?is_active=true" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### 2. GET Current Term
```
bash
curl -X GET "http://localhost:3001/api/v1/academic-terms/school/1/current" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### 3. GET Single Term by ID
```
bash
curl -X GET "http://localhost:3001/api/v1/academic-terms/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### 4. POST Create New Term
```
bash
curl -X POST "http://localhost:3001/api/v1/academic-terms" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "school_id": 1,
    "name": "Spring Term 2025",
    "year": 2025,
    "start_date": "2025-01-15",
    "end_date": "2025-04-30",
    "is_current": false,
    "is_active": true
  }'
```

### 5. PUT Update Term
```
bash
curl -X PUT "http://localhost:3001/api/v1/academic-terms/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Term 2024 (Updated)",
    "is_active": true
  }'
```

### 6. PATCH Set Current Term
```
bash
curl -X PATCH "http://localhost:3001/api/v1/academic-terms/1/set-current" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### 7. PATCH Toggle Status (Activate/Deactivate)
```
bash
curl -X PATCH "http://localhost:3001/api/v1/academic-terms/1/toggle-status" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### 8. DELETE Term
```
bash
# Note: Cannot delete the current active term
curl -X DELETE "http://localhost:3001/api/v1/academic-terms/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## Expected Responses

### Success Response Format
```
json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response Format
```
json
{
  "success": false,
  "message": "Error message"
}
```

## Testing with JavaScript/Fetch

```
javascript
const BASE_URL = 'http://localhost:3001/api/v1/academic-terms';
const TOKEN = 'YOUR_AUTH_TOKEN';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// Get all terms
async function getTerms(schoolId) {
  const response = await fetch(`${BASE_URL}/school/${schoolId}`, { headers });
  return response.json();
}

// Get current term
async function getCurrentTerm(schoolId) {
  const response = await fetch(`${BASE_URL}/school/${schoolId}/current`, { headers });
  return response.json();
}

// Create term
async function createTerm(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return response.json();
}

// Update term
async function updateTerm(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data)
  });
  return response.json();
}

// Set current term
async function setCurrentTerm(id) {
  const response = await fetch(`${BASE_URL}/${id}/set-current`, {
    method: 'PATCH',
    headers
  });
  return response.json();
}

// Toggle status
async function toggleStatus(id) {
  const response = await fetch(`${BASE_URL}/${id}/toggle-status`, {
    method: 'PATCH',
    headers
  });
  return response.json();
}

// Delete term
async function deleteTerm(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
}
```

## Troubleshooting

### Endpoint Not Found (404)
If you get a 404 error:
1. **Restart the server** - The new routes need to be loaded
2. **Check the port** - Use port 3001 (not 3000) for local development
3. **Verify the route is registered** - Check app.js has `app.use("/api/v1/academic-terms", academicTermsRoutes);`

### Authentication Error (401)
If you get a 401 error:
1. Make sure you're passing a valid JWT token
2. The token should be in the format: `Authorization: Bearer YOUR_TOKEN`
