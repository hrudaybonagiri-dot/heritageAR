# Admin Features Guide

## Overview

This guide covers the three main admin features for the AR Heritage platform:

1. **AR Viewer** - Open camera and show AR model
2. **Preserve Monument** - Scan and upload monument
3. **Admin Dashboard** - Manage heritage data

---

## 1. AR Viewer Feature

### Status: ✅ COMPLETE

### Location
- **Page**: `src/pages/ARViewer.tsx`
- **Route**: `/ar-viewer/:id`

### Features
- WebXR AR session with hit-test API
- Surface detection with visual reticle
- 3D model loading from monument data
- Tap-to-place interaction
- Model scaling and positioning
- Real-time AR rendering

### How It Works
1. User clicks "View in AR" on a monument card
2. Navigates to `/ar-viewer/:monumentId`
3. Fetches monument data including model URL
4. Initializes WebXR AR session
5. Shows camera feed with surface detection
6. User taps to place model on detected surface
7. Model appears anchored in AR space

### Usage
```typescript
// From Explore Heritage page
<Link to={`/ar-viewer/${monument.id}`}>
  <Button>View in AR</Button>
</Link>
```

### Requirements
- AR-capable Android device
- Chrome or Edge browser
- HTTPS connection
- Camera permissions

---

## 2. Preserve Monument Feature

### Status: ✅ COMPLETE

### Location
- **Component**: `src/components/ARScannerModal.tsx`
- **Utility**: `src/utils/arScanner.ts`
- **Service**: `src/services/monumentService.ts`
- **Page**: `src/pages/ExploreHeritage.tsx`

### Features
- Multi-step workflow (form → scanning → placing → capturing → uploading)
- AR camera with surface detection
- 3D model placement in AR
- Automatic thumbnail capture
- File upload to backend
- Real-time status updates
- Error handling

### How It Works
1. User clicks "Add New Heritage" button
2. Fills monument details form
3. Clicks "Start AR Scanning"
4. AR session starts with camera
5. Green reticle shows on detected surfaces
6. User taps to place 3D model
7. Thumbnail automatically captured
8. Data uploaded to backend
9. Monument appears in list

### API Endpoint
```
POST /api/monuments
Content-Type: multipart/form-data

Fields:
- name (required)
- description (required)
- location
- historical_era
- thumbnail (file)
- model (file)
```

### Usage
```typescript
// In ExploreHeritage page
<Button onClick={() => setShowARScanner(true)}>
  Add New Heritage
</Button>

<ARScannerModal 
  open={showARScanner}
  onClose={() => setShowARScanner(false)}
  onSuccess={handleScanSuccess}
/>
```

---

## 3. Admin Dashboard Feature

### Status: 🔨 TO BE IMPLEMENTED

### Proposed Location
- **Page**: `src/pages/AdminDashboard.tsx`
- **Route**: `/admin/dashboard`

### Proposed Features

#### Dashboard Overview
- Total monuments count
- Critical risks count
- Recent restorations count
- Average condition status

#### Data Visualization
- Pie chart: Monument condition distribution
- Bar chart: Monuments by condition
- Line chart: Restoration trends over time
- Risk severity breakdown

#### Monument Management
- List all monuments by condition
- Filter by era, location, condition
- Quick edit/delete actions
- Bulk operations

#### Risk Management
- View critical environmental risks
- Risk severity indicators
- Location-based risk mapping
- Add/edit/delete risks

#### Restoration Tracking
- Recent restoration projects
- Cost tracking and analytics
- Before/after image comparison
- Contractor management

#### Quick Actions
- Upload new monument
- View all monuments
- Generate reports
- Export data

### Implementation Plan

#### Step 1: Create Admin Dashboard Page

```typescript
// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    const response = await fetch('/api/preservation/dashboard');
    const data = await response.json();
    setStats(data);
  };
  
  return (
    <div>
      {/* Dashboard content */}
    </div>
  );
};
```

#### Step 2: Add Route to App.tsx

```typescript
import AdminDashboard from '@/pages/AdminDashboard';

<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

#### Step 3: Add Navigation Link

```typescript
// In Navbar.tsx
<Link to="/admin/dashboard">Admin Dashboard</Link>
```

#### Step 4: Backend API (Already Exists)

```javascript
// GET /api/preservation/dashboard
app.get('/api/preservation/dashboard', (req, res) => {
  res.json({
    monument_conditions: [
      { condition_status: "excellent", count: 5 },
      { condition_status: "good", count: 12 },
      { condition_status: "fair", count: 18 },
      { condition_status: "poor", count: 8 },
      { condition_status: "critical", count: 3 }
    ],
    critical_risks: [...],
    recent_restorations: [...]
  });
});
```

---

## Feature Comparison

| Feature | Status | AR Required | Backend API | Mobile Only |
|---------|--------|-------------|-------------|-------------|
| AR Viewer | ✅ Complete | Yes | GET /monuments/:id | Yes |
| Preserve Monument | ✅ Complete | Yes | POST /monuments | Yes |
| Admin Dashboard | 🔨 Pending | No | GET /preservation/* | No |

---

## Quick Start

### 1. Start Servers

```bash
# Backend
cd backend && npm run dev

# Frontend
cd .. && npm run dev
```

### 2. Test AR Viewer

1. Navigate to http://localhost:8080/explore-heritage
2. Click "View in AR" on any monument
3. Grant camera permissions
4. Point at flat surface
5. Tap to place model

### 3. Test Preserve Monument

1. Navigate to http://localhost:8080/explore-heritage
2. Click "Add New Heritage" button
3. Fill monument details
4. Click "Start AR Scanning"
5. Point at surface, tap to place
6. Wait for automatic upload

### 4. Access Admin Dashboard (When Implemented)

1. Navigate to http://localhost:8080/admin/dashboard
2. View statistics and charts
3. Manage monuments, risks, restorations
4. Use quick actions

---

## API Endpoints

### Monuments
- `GET /api/monuments` - List all monuments
- `GET /api/monuments/:id` - Get monument details
- `POST /api/monuments` - Create new monument
- `PUT /api/monuments/:id` - Update monument
- `DELETE /api/monuments/:id` - Delete monument

### Preservation
- `GET /api/preservation/dashboard` - Dashboard statistics
- `GET /api/preservation/versions/:monumentId` - Version history
- `GET /api/preservation/risks/:monumentId` - Environmental risks
- `GET /api/preservation/restorations/:monumentId` - Restoration records
- `GET /api/preservation/analytics/:monumentId` - Monument analytics

---

## File Structure

```
src/
├── pages/
│   ├── ARViewer.tsx              ✅ Complete
│   ├── ExploreHeritage.tsx       ✅ Complete (with AR Scanner)
│   ├── AdminUpload.tsx           ✅ Complete
│   └── AdminDashboard.tsx        🔨 To be created
├── components/
│   └── ARScannerModal.tsx        ✅ Complete
├── utils/
│   └── arScanner.ts              ✅ Complete
└── services/
    └── monumentService.ts        ✅ Complete

backend/
└── src/
    ├── server-simple.js          ✅ Complete
    └── routes/
        └── monument-preservation.js  ✅ Complete
```

---

## Next Steps

### For AR Viewer
- ✅ Already complete and functional
- Test on AR-capable device
- Verify model loading and placement

### For Preserve Monument
- ✅ Already complete and functional
- Test complete workflow on device
- Verify thumbnail capture and upload

### For Admin Dashboard
1. Create `AdminDashboard.tsx` page
2. Add route to `App.tsx`
3. Implement data visualization with recharts
4. Add monument management table
5. Implement risk and restoration views
6. Add quick action buttons
7. Test all dashboard features

---

## Testing Checklist

### AR Viewer
- [ ] Monument loads from API
- [ ] AR session starts
- [ ] Surface detection works
- [ ] Model places correctly
- [ ] Model stays anchored

### Preserve Monument
- [ ] Form validation works
- [ ] AR session starts
- [ ] Surface detection shows reticle
- [ ] Model places on tap
- [ ] Thumbnail captures
- [ ] Upload succeeds
- [ ] Monument appears in list

### Admin Dashboard (When Implemented)
- [ ] Dashboard loads statistics
- [ ] Charts render correctly
- [ ] Monument list displays
- [ ] Filters work
- [ ] Risk list displays
- [ ] Restoration list displays
- [ ] Quick actions work

---

## Documentation

- **AR_SCANNER_README.md** - AR Scanner quick start
- **AR_SCANNER_IMPLEMENTATION.md** - Technical details
- **AR_SCANNER_TESTING.md** - Testing guide
- **AR_TESTING_GUIDE.md** - General AR testing
- **AR_SURFACE_DETECTION_GUIDE.md** - Surface detection guide
- **TASK_COMPLETION_SUMMARY.md** - Implementation summary

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify device AR support
3. Check backend logs
4. Review documentation files
5. Test on different devices

---

**Last Updated**: March 4, 2026  
**Status**: 2/3 Features Complete
