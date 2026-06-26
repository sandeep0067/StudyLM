# 🎨 StudyLM Design System & Component Guide

## Core Design Tokens

### Typography
```jsx
// Headings
text-7xl  // Hero main title
text-5xl  // Section headings
text-4xl  // Subsection headings
text-xl   // Card titles
text-sm   // Secondary labels

// Font Weights
font-bold   // Headlines
font-semibold // Subheadings
font-medium // Labels
// default = font-normal (body text)

// Line Height
leading-tight   // Headings
leading-relaxed // Body text
```

### Spacing Scale
```jsx
py-24  // Large sections
py-20  // Medium sections
py-16  // Small sections

px-4 sm:px-6 lg:px-8  // Horizontal padding pattern

gap-8  // Element spacing
gap-6  // Card spacing
gap-4  // Tight spacing
```

### Color Gradients
```jsx
// Primary (buttons, main CTAs)
from-indigo-600 to-purple-600

// Secondary (features)
from-amber-400 to-orange-500
from-blue-400 to-cyan-500
from-emerald-400 to-teal-500
from-purple-400 to-pink-500
from-rose-400 to-red-500
from-indigo-400 to-blue-500
```

### Border Radius
```jsx
rounded-lg   // Small buttons, icons
rounded-xl   // Medium cards, elements
rounded-2xl  // Large sections, hero mock
rounded-full // Pills, circles
```

## Component Patterns

### Navigation Bar Pattern
```jsx
<nav className="fixed w-full bg-white/70 backdrop-blur-xl z-50 border-b border-slate-100/50">
  {/* Sticky header with frosted glass effect */}
</nav>
```

### Hero Section Pattern
```jsx
<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Two-column asymmetrical layout */}
    </div>
  </div>
</section>
```

### Feature Card Pattern
```jsx
<div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 
               bg-white p-8 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5" />
  {/* Card content with subtle hover effects */}
</div>
```

### Section Background Pattern
```jsx
<section className="bg-white/50 backdrop-blur-sm">
  {/* Semi-transparent with frosted glass effect */}
</section>
```

### CTA Button Pattern
```jsx
<button className="px-8 py-4 text-base font-semibold text-white 
                   bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg 
                   hover:shadow-2xl hover:shadow-indigo-500/30 transition-all 
                   duration-300 hover:scale-105 group">
  {/* Gradient background with shadow and scale on hover */}
</button>
```

## Responsive Design Patterns

### Mobile-First Approach
```jsx
// Default = mobile
px-4

// Tablet and up
sm:px-6

// Desktop and up
lg:px-8

// Grid layouts
grid-cols-1       // Mobile: 1 column
md:grid-cols-2    // Tablet: 2 columns
lg:grid-cols-3    // Desktop: 3 columns
```

### Visibility Classes
```jsx
hidden md:flex    // Hidden on mobile, flex on tablet+
hidden sm:block   // Hidden on mobile, block on small+
md:hidden         // Hidden on tablet+
```

### Spacing Adjustments
```jsx
text-5xl sm:text-6xl lg:text-7xl    // Responsive typography
gap-6 lg:gap-8                       // Responsive gaps
p-8 sm:p-12 lg:p-16                  // Responsive padding
```

## Animation & Transition Patterns

### Smooth Transitions
```jsx
transition-all duration-300           // All properties
transition-colors duration-300        // Color only
transition-transform duration-300     // Transform only
transition-shadow duration-300        // Shadow only
```

### Hover Effects
```jsx
hover:scale-105              // Slight zoom
hover:shadow-xl              // Enhanced shadow
hover:border-slate-300       // Border color change
hover:bg-slate-50            // Background color change
group-hover:opacity-100      // Parent-triggered opacity
group-hover:translate-x-1    // Icon slide on parent hover
```

### Transform Effects
```jsx
group-hover:scale-110        // Icon/element zoom
group-hover:translate-x-1    // Icon slide right
scale-100 -> scale-105       // Subtle scale animation
translate-x-0 -> translate-x-1  // Subtle movement
```

## State Patterns

### Interactive Elements
```jsx
<button className="... hover:... active:... focus:...">
  {/* Covers all interaction states */}
</button>
```

### Group Hover
```jsx
<div className="group hover:...">
  <element className="group-hover:..." />
</div>
```

## Gradient Patterns

### Text Gradient
```jsx
<span className="bg-gradient-to-r from-indigo-600 to-purple-600 
                 bg-clip-text text-transparent">
  Gradient text
</span>
```

### Background Gradient
```jsx
<div className="bg-gradient-to-br from-indigo-600 to-purple-600">
  {/* Gradient background */}
</div>
```

### Directional Gradients
```jsx
to-r    // left to right
to-b    // top to bottom
to-br   // top-left to bottom-right
to-tr   // top-right to bottom-left
```

## Common Component Combinations

### Section with Background Pattern
```jsx
<section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Card with Icon and Text
```jsx
<div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 
               bg-white p-8 hover:border-slate-300 transition-all duration-300 hover:shadow-xl">
  <div className={`relative z-10 mb-6 w-12 h-12 rounded-xl 
                  bg-gradient-to-br ${color} flex items-center justify-center 
                  text-white group-hover:scale-110 transition-transform duration-300`}>
    <IconComponent size={24} />
  </div>
  <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
  <p className="text-slate-600 leading-relaxed">{description}</p>
</div>
```

### Pill Badge
```jsx
<span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider 
                 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
  ✨ Label
</span>
```

## Accessibility Patterns

### Focus States
```jsx
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
```

### Semantic HTML
```jsx
<button>        // Interactive elements
<a href="">     // Navigation
<h1-h6>         // Headings in order
<nav>           // Navigation section
<section>       // Content sections
<footer>        // Footer area
<span>          // Inline text
<p>             // Paragraphs
```

### Color Contrast
- Text on light backgrounds: Slate 900 or darker
- Text on dark backgrounds: White or light slate
- Minimum contrast ratio: 4.5:1 for normal text

## Performance Tips

### CSS Optimization
- Use Tailwind's purge feature (configured in tailwind.config.js)
- Group similar classes for readability
- Use CSS variables in config for consistency

### Layout Optimization
```jsx
// Good: Single container
<div className="max-w-7xl mx-auto">

// Avoid: Multiple nested containers
<div className="max-w-7xl mx-auto">
  <div className="max-w-6xl mx-auto">
    {/* Unnecessary nesting */}
  </div>
</div>
```

### Animation Performance
```jsx
// Good: Hardware-accelerated
transform: scale(), translateX(), opacity

// Avoid
width, height, margin changes on animation
```

## Customization Quick Reference

### Change primary color scheme
1. Find `indigo-600` and `purple-600`
2. Replace with preferred Tailwind colors
3. Update feature card gradient colors
4. Test contrast ratios for accessibility

### Add new section
1. Copy existing section pattern
2. Adjust `py-24` for section size
3. Use `max-w-7xl mx-auto` for container
4. Follow spacing patterns (`gap-8`, `p-8`)
5. Add to navigation links if needed

### Modify feature cards
1. Update `features` array in component
2. Change icon, title, description
3. Modify gradient `color` property
4. Test hover effects

### Change typography
1. Update Tailwind config `theme.extend.fontSize`
2. Or use Tailwind's standard scale
3. Maintain hierarchy (h1 > h2 > h3 > p)

---

**Pro Tips:**
- Always use Tailwind's scale for consistency
- Test all hover states during development
- Check mobile view frequently
- Verify color contrast for accessibility
- Use browser DevTools to inspect and adjust spacing
