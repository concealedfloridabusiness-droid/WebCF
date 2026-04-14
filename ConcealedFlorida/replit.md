# Concealed Florida Website

## Overview
A fully static, client-side website for Concealed Florida featuring a clean, modern design with a black background, gray buttons, and white text. The site provides information about preparedness, situational awareness, and everyday-carry equipment.

## Project Structure

### Pages
- **Homepage** (`/`) - Features blurred Florida Panther logo background with three main navigation buttons
- **We Are Ready** (`/we-are-ready`) - Physical readiness and emergency preparedness content
- **We Are Watching** (`/we-are-watching`) - Situational awareness and local laws information
- **We Are Hiding in Plain Sight** (`/we-are-hiding`) - Everyday-carry gear and equipment content

### Components
- **Header** - Reusable navigation component with logo and page links
- **Footer** - Reusable footer with copyright and disclaimer
- **Layout** - Wrapper component that includes Header and Footer on all pages

## Design System

### Color Scheme
- **Background**: Black (`#000000`)
- **Buttons/Tabs**: Gray (`bg-gray-700` with `hover:bg-gray-600`)
- **Text**: White (`#FFFFFF`)
- **Borders**: Dark gray (`border-gray-800`)

### Typography
- Clean, modern sans-serif font (Inter/Open Sans)
- White text for maximum contrast on black background
- Responsive text sizes for mobile and desktop

### Layout
- Responsive design that works on all devices
- Consistent spacing and padding throughout
- Center-aligned content on homepage
- Maximum width containers for readability

## Adding Your Own Images

### Florida Panther Logo
To add your own Florida Panther logo to the homepage:

1. Add your image to the `attached_assets` folder
2. In `client/src/pages/HomePage.tsx`, replace the placeholder with:
   ```tsx
   import logoImage from '@assets/your-logo-filename.png';
   
   // Then update the background div to use your image
   <div className="absolute inset-0">
     <img 
       src={logoImage} 
       alt="Florida Panther Logo" 
       className="w-full h-full object-cover blur-sm opacity-20"
     />
   </div>
   ```

### Company Logo (Header)
To add a company logo to the header:

1. Add your logo image to `attached_assets`
2. In `client/src/components/Header.tsx`, replace the "CF" placeholder with your logo image

## Technical Details

- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side navigation
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Hosting**: Replit (static deployment)

## Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5000`

## Adding Content

To add content to the three main pages, edit:
- `client/src/pages/WeAreReady.tsx`
- `client/src/pages/WeAreWatching.tsx`
- `client/src/pages/WeAreHiding.tsx`

Each page already has the header, footer, and basic layout structure. Simply replace the "Content coming soon" placeholder with your custom content.

## Recent Changes
- **2025-10-16 (Latest)**: Added next-phase enhancements
  - Image upload capability for logo (stored in localStorage)
  - Smooth page transitions with framer-motion
  - Expandable content sections with accordions on all three main pages
  - Contact form with client-side validation using Zod
  - SEO meta tags and Open Graph/Twitter Card optimization
  - New Contact page with form validation
- **2025-10-16**: Initial website creation with all pages and navigation
  - Static site with black/gray/white color scheme
  - Reusable header and footer components
  - Five pages with responsive design (Home, We Are Ready, We Are Watching, We Are Hiding, Contact)
  - Placeholder for Florida Panther logo (ready for user images)
