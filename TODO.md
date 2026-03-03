#

## Tasks
- [ ] Create API service file for fee structures
- [ ] Modify FeeStructure.tsx to fetch data from API
- [ ] Add loading and error states
- [ ] Connect CRUD operations to API

## Implementation Details

### API Service (Frontend/src/lib/api/feeStructureApi.ts)
- GET /api/v1/fee-structures - List all fee structures
- GET /api/v1/fee-structures/:id - Get single fee structure
- POST /api/v1/fee-structures - Create fee structure
- PUT /api/v1/fee-structures/:id - Update fee structure
- DELETE /api/v1/fee-structures/:id - Delete fee structure
- GET /api/v1/fee-structures/summary - Get fee summary

### FeeStructure.tsx Changes
- Replace SEED data with API fetch
- Transform API response to match component's data structure
- Add loading/error states
- Connect edit modal to PUT API
- Connect delete to DELETE API
