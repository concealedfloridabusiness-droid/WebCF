# Design Guidelines for Concealed Florida Website

## Design Approach
**User-Specified Design**: The client has provided explicit visual guidelines that must be followed exactly as specified.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: Black (#000000 or 0 0% 0%)
- Buttons/Tabs: Gray 
- Text: White (#FFFFFF or 0 0% 100%)

### B. Typography
- Font Style: Clean, modern, easy to read
- Primary Text: White on black background
- Use web-safe fonts or Google Fonts for reliability

### C. Layout System
- Use Tailwind CSS spacing utilities
- Maintain consistent spacing for header, main content, and footer
- Center-aligned homepage content
- Responsive layout that works on all devices

### D. Component Specifications

**Header (All Pages)**
- Logo + Company Name: "Concealed Florida"
- Navigation Tabs:
  - Home (links to homepage)
  - We Are Ready
  - We Are Watching
  - We Are Hiding in Plain Sight
- Style: Gray tabs/buttons with white text

**Homepage Main Section**
- Background: Blurred Florida Panther logo (PNG) - slight blur effect
- Central Element: Display logo/PNG prominently in center
- Three Buttons (stacked vertically under logo):
  1. "We Are Ready"
  2. "We Are Watching"  
  3. "We Are Hiding in Plain Sight"
- Button Style: Gray background, white text
- Summary Text (beneath each button):
  - "We Are Ready" → Physical readiness and emergency preparedness
  - "We Are Watching" → Situational awareness and knowledge of local laws
  - "We Are Hiding in Plain Sight" → Everyday-carry gear and safe, practical equipment

**Footer (All Pages - Reusable Component)**
- Text: "© 2025 Concealed Florida | Informational only, not legal or medical advice"
- Style: Consistent with overall black/gray/white theme
- Must automatically appear on all pages

**Additional Pages**
- We Are Ready (placeholder)
- We Are Watching (placeholder)
- We Are Hiding in Plain Sight (placeholder)
- Each includes: same header, same footer, placeholder heading

### E. Images

**Homepage Hero**
- Large centered image: Florida Panther logo (PNG)
- Effect: Slightly blurred background
- Image serves as main visual focal point on homepage

**Placeholder for User Images**
- Image elements ready for user to add their own images later
- Maintain black background behind all images

## Navigation & Interaction

- All header navigation tabs link to respective pages
- Home button returns to homepage from any page
- Footer appears consistently across all pages
- Client-side navigation only (no backend)

## Technical Constraints

- HTML, CSS (Tailwind CSS), JavaScript only
- Fully client-side, static website
- No paid services, logins, or external APIs
- Reusable header/footer components (include once, appear everywhere)
- Clean, well-commented code for easy expansion
- Replit-ready deployment

## Accessibility
- Maintain dark mode (black background) throughout
- Ensure white text has sufficient contrast on black/gray backgrounds
- Clear navigation structure with descriptive labels