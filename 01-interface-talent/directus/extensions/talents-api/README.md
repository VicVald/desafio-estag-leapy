# Talents API Extension

This Directus extension provides a custom API endpoint for fetching talents with advanced filtering, pagination, and search capabilities.

## Endpoint

```
GET /talents-api/talents
```

## Query Parameters

### Pagination
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Number of items per page

### Sorting
- `sort` (string or array): Sort fields. Use `-` prefix for descending order. Default: `-date_updated`

### Filters
- `department` (string): Filter by department
- `current_status` (string): Filter by current status
- `pdi_plan_ready` (boolean): Filter by PDI plan ready status (`true`/`false`)
- `orchestrator_state` (string): Filter by orchestrator state
- `start_date_gte` (date): Start date greater than or equal
- `start_date_lte` (date): Start date less than or equal
- `end_date_gte` (date): End date greater than or equal
- `end_date_lte` (date): End date less than or equal
- `leader_id` (number): Filter by leader ID
- `target_role_id` (number): Filter by target role ID

### Search
- `search` (string): Search by user email (case-insensitive partial match)

## Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "user@example.com",
      "phone_number": "123456789",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2025-01-01T00:00:00.000Z",
      "department": "Engineering",
      "current_status": "ACTIVE",
      "pdi_plan_ready": true,
      "orchestrator_state": "COMPLETED",
      "leader_id": 1,
      "leader_email": "leader@example.com",
      "target_role_id": 1,
      "target_role_name": "Senior Developer",
      "date_created": "2024-01-01T00:00:00.000Z",
      "date_updated": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Examples

### Basic pagination
```
GET /talents-api/talents?page=1&limit=20
```

### Filter by department and status
```
GET /talents-api/talents?department=Engineering&current_status=ACTIVE
```

### Search by email
```
GET /talents-api/talents?search=test@example.com
```

### Date range filter
```
GET /talents-api/talents?start_date_gte=2024-01-01&end_date_lte=2025-12-31
```

### Combined filters with sorting
```
GET /talents-api/talents?department=Engineering&pdi_plan_ready=true&sort=-date_updated&page=1&limit=10
```

## Authentication

This endpoint requires authentication via Directus token (Bearer token in Authorization header).

## Notes

- All date filters use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)
- Search is case-insensitive and supports partial matches
- Boolean filters accept `true`/`false` strings
- The endpoint includes related data from users, leaders, and target roles