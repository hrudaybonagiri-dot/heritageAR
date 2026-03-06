# Navigation Guide

## Website Structure

The website has been restructured with separate pages for each section. Each page can be accessed independently through the navigation menu.

## Available Pages

### 1. Home Page (`/`)
- Hero section with main call-to-action
- Clean landing page design

### 2. About Page (`/about`)
- Information about the AR Heritage platform
- Mission and vision
- Three core features:
  - Monument Preservation
  - Immersive Experience
  - Digital Archiving

### 3. Features Page (`/features`)
- Detailed feature showcase
- AR capabilities
- Technology highlights

### 4. How It Works Page (`/how-it-works`)
- Step-by-step guide
- User journey
- Process explanation

### 5. Gallery Page (`/gallery`)
- Visual showcase
- AR examples
- Heritage sites

### 6. Impact Page (`/impact`)
- Statistics and metrics
- Success stories
- Global reach

### 7. Testimonials Page (`/testimonials`)
- User reviews
- Expert opinions
- Case studies

### 8. Contact Page (`/contact`)
- Contact form
- Get in touch
- Support information

## Navigation Features

- **Active Link Highlighting**: Current page is highlighted in the navigation menu
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Smooth Transitions**: Page transitions with React Router
- **Persistent Navigation**: Navbar appears on all pages

## Backend API

Backend server is running on: **http://localhost:5001**

### Available Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/monuments` - List monuments
- `GET /api/experiences` - List AR experiences
- `GET /api/artifacts` - List artifacts
- `GET /health` - Health check

### Test Credentials:
- Email: admin@example.com
- Password: password123
- Role: admin

## Frontend

Frontend is running on: **http://localhost:8080**

## How to Navigate

1. Click on any menu item in the navigation bar
2. Each section opens as a separate page
3. Use the "Get Started" button to go to the contact page
4. Click "HeritageAR" logo to return to home page

## Development

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + JSON Database
- Styling: Tailwind CSS + Shadcn UI
- Animations: Framer Motion
- Routing: React Router v6
