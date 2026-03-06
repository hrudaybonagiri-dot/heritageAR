# Testing Monument Preservation API

Quick guide to test the Monument Preservation endpoints.

## Prerequisites

1. Start the backend server:
```bash
cd backend
npm install
npm run dev
```

Server will run on `http://localhost:5000`

## Test Endpoints with cURL

### 1. Get All Monuments
```bash
curl http://localhost:5000/api/monuments
```

### 2. Get Monument Details with Full History
```bash
curl http://localhost:5000/api/monuments/1
```

### 3. Get Monument Versions
```bash
curl http://localhost:5000/api/preservation/versions/1
```

### 4. Get Environmental Risks
```bash
curl http://localhost:5000/api/preservation/risks/1
```

### 5. Get Risk Summary
```bash
curl http://localhost:5000/api/preservation/risks/summary/1
```

### 6. Get Restoration Records
```bash
curl http://localhost:5000/api/preservation/restorations/1
```

### 7. Get Restoration Statistics
```bash
curl http://localhost:5000/api/preservation/restorations/stats/1
```

### 8. Get Monument Analytics
```bash
curl http://localhost:5000/api/preservation/analytics/1
```

### 9. Get Preservation Dashboard
```bash
curl http://localhost:5000/api/preservation/dashboard
```

## Test with JavaScript (Browser Console or Node.js)

```javascript
// Get all monuments
fetch('http://localhost:5000/api/monuments')
  .then(res => res.json())
  .then(data => console.log('Monuments:', data));

// Get monument details with full history
fetch('http://localhost:5000/api/monuments/1')
  .then(res => res.json())
  .then(data => console.log('Monument Details:', data));

// Get monument versions
fetch('http://localhost:5000/api/preservation/versions/1')
  .then(res => res.json())
  .then(data => console.log('Versions:', data));

// Get environmental risks
fetch('http://localhost:5000/api/preservation/risks/1')
  .then(res => res.json())
  .then(data => console.log('Risks:', data));

// Get risk summary
fetch('http://localhost:5000/api/preservation/risks/summary/1')
  .then(res => res.json())
  .then(data => console.log('Risk Summary:', data));

// Get restoration records
fetch('http://localhost:5000/api/preservation/restorations/1')
  .then(res => res.json())
  .then(data => console.log('Restorations:', data));

// Get restoration stats
fetch('http://localhost:5000/api/preservation/restorations/stats/1')
  .then(res => res.json())
  .then(data => console.log('Restoration Stats:', data));

// Get monument analytics
fetch('http://localhost:5000/api/preservation/analytics/1')
  .then(res => res.json())
  .then(data => console.log('Analytics:', data));

// Get preservation dashboard
fetch('http://localhost:5000/api/preservation/dashboard')
  .then(res => res.json())
  .then(data => console.log('Dashboard:', data));
```

## Test with Postman

1. Import the following collection:

### GET Requests
- `GET http://localhost:5000/api/monuments`
- `GET http://localhost:5000/api/monuments/1`
- `GET http://localhost:5000/api/preservation/versions/1`
- `GET http://localhost:5000/api/preservation/risks/1`
- `GET http://localhost:5000/api/preservation/risks/summary/1`
- `GET http://localhost:5000/api/preservation/restorations/1`
- `GET http://localhost:5000/api/preservation/restorations/stats/1`
- `GET http://localhost:5000/api/preservation/analytics/1`
- `GET http://localhost:5000/api/preservation/dashboard`

## Expected Responses

### Monument List
```json
{
  "data": [
    {
      "id": 1,
      "name": "Colosseum",
      "location": "Rome, Italy",
      "condition_status": "fair",
      ...
    }
  ]
}
```

### Monument Details
```json
{
  "id": 1,
  "name": "Colosseum",
  "versions": [...],
  "environmental_risks": [...],
  "restoration_records": [...]
}
```

### Analytics
```json
{
  "monument": {...},
  "analytics": {
    "total_versions": 3,
    "environmental_risks": {
      "critical": 1,
      "high": 2,
      "medium": 3,
      "low": 1
    },
    "restoration_summary": {
      "total_restorations": 5,
      "total_cost": 2500000.00
    }
  }
}
```

## Integration Testing

Create a simple HTML page to test the API:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Monument Preservation API Test</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    button { margin: 10px; padding: 10px 20px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Monument Preservation API Test</h1>
  
  <button onclick="testMonuments()">Get Monuments</button>
  <button onclick="testMonumentDetails()">Get Monument Details</button>
  <button onclick="testVersions()">Get Versions</button>
  <button onclick="testRisks()">Get Risks</button>
  <button onclick="testAnalytics()">Get Analytics</button>
  <button onclick="testDashboard()">Get Dashboard</button>
  
  <h2>Response:</h2>
  <pre id="output">Click a button to test an endpoint...</pre>

  <script>
    const API_BASE = 'http://localhost:5000/api';
    const output = document.getElementById('output');

    async function testEndpoint(url, label) {
      try {
        output.textContent = `Loading ${label}...`;
        const response = await fetch(url);
        const data = await response.json();
        output.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        output.textContent = `Error: ${error.message}`;
      }
    }

    function testMonuments() {
      testEndpoint(`${API_BASE}/monuments`, 'Monuments');
    }

    function testMonumentDetails() {
      testEndpoint(`${API_BASE}/monuments/1`, 'Monument Details');
    }

    function testVersions() {
      testEndpoint(`${API_BASE}/preservation/versions/1`, 'Versions');
    }

    function testRisks() {
      testEndpoint(`${API_BASE}/preservation/risks/1`, 'Risks');
    }

    function testAnalytics() {
      testEndpoint(`${API_BASE}/preservation/analytics/1`, 'Analytics');
    }

    function testDashboard() {
      testEndpoint(`${API_BASE}/preservation/dashboard`, 'Dashboard');
    }
  </script>
</body>
</html>
```

Save this as `test-api.html` and open it in a browser while the backend server is running.

## Troubleshooting

### CORS Issues
If testing from a browser and getting CORS errors, the backend already has CORS enabled. Make sure the server is running.

### Connection Refused
Make sure the backend server is running on port 5000:
```bash
cd backend
npm run dev
```

### 404 Not Found
Verify you're using the correct endpoint URLs as listed above.

## Next Steps

Once basic endpoints are working:
1. Test with authentication (register/login first)
2. Test POST endpoints for creating versions, risks, and restorations
3. Test file uploads for 3D models and images
4. Integrate with the frontend React application

