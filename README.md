# Legend Has It - Hi-Fi Listening Bar

## Overview
Legend Has It is Sacramento's first hi-fi listening bar, where music meets the art of sound. This web application serves as the digital presence for the establishment, featuring an immersive audio experience, event management, and customer interaction capabilities.

## Features
- 🎵 Hi-Fi Music Player with curated playlists
- 📅 Event Management System
- 💌 Contact Forms (Event, DJ, and General inquiries)
- 🍺 Dynamic Menu Management
- 📱 Responsive Design
- 🎨 GSAP Animations
- 🔐 Authentication (Kinde Auth)
- 📨 Mailchimp Integration

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - GSAP for animations
- **Database**: MongoDB with Mongoose
- **Authentication**: Kinde Auth
- **Form Management**: 
  - React Hook Form
  - Zod for validation
- **UI Components**:
  - Radix UI
  - Shadcn/ui
  - Material UI
- **API Integration**:
  - SendGrid
  - Mailchimp
  - Square

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- MongoDB instance

### Environment Variables
Create a `.env` file in the root directory with the following variables:

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Kinde Auth
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=your_kinde_issuer_url
KINDE_SITE_URL=your_site_url
KINDE_POST_LOGOUT_REDIRECT_URL=your_logout_redirect_url
KINDE_POST_LOGIN_REDIRECT_URL=your_login_redirect_url

# Square API
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox_or_production

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Mailchimp
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=your_server_prefix
MAILCHIMP_LIST_ID=your_audience_list_id

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
├── data/            # Type definitions and data schemas
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── models/          # MongoDB models
└── utils/           # Helper functions
```

## Menu Management System

### Overview
The menu system integrates with Square's Catalog and Inventory APIs to provide real-time inventory management and dynamic menu display. The system supports hierarchical category organization and automatic inventory tracking.

### Features
- **Real-time Inventory Sync**: Automatically syncs with Square's inventory system
- **Category Management**: 
  - Hierarchical category structure (parent/child relationships)
  - Custom category ordering
  - Dynamic category creation and modification
- **Menu Items**:
  - Detailed product information (name, brand, ABV, price, description)
  - Automatic stock status updates
  - Support for multiple pricing formats (draft/bottle)
- **Fallback System**:
  - Caches menu data in MongoDB
  - Ensures menu availability during Square API downtime
  - Automatic fallback version management

### Menu Structure
```typescript
interface MenuItem {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price: string;
  abv?: string;
  city?: string;
  inStock: boolean;
}

interface CategoryWithItems {
  id: string;
  name: string;
  items: MenuItem[];
  childCategories: CategoryWithItems[];
}
```

### Admin Features
- Create, update, and delete menu categories
- Manage item availability
- Real-time inventory updates
- Batch category updates
- Menu version control

### Integration Points
- Square Catalog API for item management
- Square Inventory API for stock levels
- MongoDB for fallback data storage
- Custom caching layer for performance optimization



