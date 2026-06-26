# StudyLM Landing Page - Setup Instructions

## Quick Start with Vite + React

### Option 1: Create a New React Project

```bash
npm create vite@latest studylm-landing -- --template react
cd studylm-landing
npm install
```

Then replace the contents of:
- `src/App.jsx` with the provided `App.jsx`
- `src/main.jsx` with the provided `main.jsx`
- `src/index.css` with the provided `index.css`
- Create `src/StudyLM.jsx` with the provided `StudyLM.jsx`

Make sure `lucide-react` is installed:
```bash
npm install lucide-react
```

Then run:
```bash
npm run dev
```

### Option 2: Use with Existing React Project

1. Install dependencies (if not already installed):
```bash
npm install lucide-react
```

2. Copy `StudyLM.jsx` to your `src` folder

3. Import and use in your app:
```jsx
import StudyLMLanding from './StudyLM'

export default function App() {
  return <StudyLMLanding />
}
```

4. Make sure Tailwind CSS is configured in your project

### Option 3: Quick Preview with CDN

Use `index.html` directly in a browser by serving it with a local server:

```bash
npx http-server .
```

## Required Dependencies

- React 18+
- Tailwind CSS
- lucide-react (for icons)

## Tailwind CSS Setup

If Tailwind is not installed, follow this guide:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then configure `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## File Structure

```
studylm-landing/
├── src/
│   ├── App.jsx
│   ├── StudyLM.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Features Included

✅ Fully responsive (mobile, tablet, desktop)
✅ No external UI libraries (pure Tailwind + Lucide icons)
✅ Smooth animations and transitions
✅ Semantic HTML
✅ Accessible design
✅ Professional color palette
✅ Component-based structure
✅ Production-ready code

## Customization

### Colors
All gradient colors are in Tailwind format. To change the primary colors:
- Find all instances of `from-indigo-600 to-purple-600`
- Replace with your preferred Tailwind color combination

### Icons
Icons are from `lucide-react`. To change:
- Import different icons from lucide-react
- Replace the icon components

### Content
All text content can be easily modified in the JSX:
- Update headlines in the hero section
- Modify feature descriptions
- Change button text
- Update footer content

### Spacing & Typography
All spacing and typography use Tailwind's standard scale (top, text-lg, p-8, etc.)
Modify `tailwind.config.js` to customize the design system.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Performance Tips

1. Use React.memo for components if needed
2. Lazy load images when adding them
3. Use code splitting for routes if expanding
4. Minimize bundle by tree-shaking unused code

## Deployment

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Vercel
```bash
npm run build
# Connect your repo and Vercel will handle it automatically
```

### Traditional Hosting
```bash
npm run build
# Upload the dist/ folder to your server
```

## Need Help?

Check that you have:
- Node.js 16+ installed
- All dependencies installed (`npm install`)
- Tailwind CSS properly configured
- lucide-react package installed
