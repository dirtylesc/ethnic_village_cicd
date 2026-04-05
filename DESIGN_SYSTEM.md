# Design System

This document describes the design system used in the Ethnic Village Travel frontend.

## Overview

The design system is built on **Radix UI + Tailwind CSS** following the shadcn/ui pattern. Components are located in `src/components/ui/`.

## UI Components

### Layout
| Component | Description |
|-----------|-------------|
| `container` | Content wrapper with max-width constraints |
| `card` | Card container with header, content, footer slots |
| `separator` | Visual divider (horizontal/vertical) |
| `scroll-area` | Custom scrollable container |
| `sheet` | Slide-out panel from screen edge |
| `sidebar` | Collapsible sidebar navigation |
| `drawer` | Bottom sheet / drawer component |

### Form Elements
| Component | Description |
|-----------|-------------|
| `button` | Primary button with variants (default, destructive, outline, secondary, ghost, link) |
| `input` | Text input field |
| `checkbox` | Checkbox with label support |
| `radio-group` | Radio button group |
| `select` | Dropdown select menu |
| `switch` | Toggle switch |
| `textarea` | Multi-line text input |
| `form` | Form wrapper with react-hook-form integration |
| `label` | Form label |
| `slider` | Single value slider |
| `range-slider` | Dual-handle range slider |
| `file-upload` | File upload with drag & drop |
| `toggle` | Toggle button |
| `toggle-group` | Group of toggle buttons |

### Feedback
| Component | Description |
|-----------|-------------|
| `alert-dialog` | Confirmation dialog with actions |
| `toast` | Toast notification |
| `toaster` | Toast container/provider |
| `progress` | Progress bar |
| `skeleton` | Loading placeholder |
| `badge` | Status/label badge |
| `tooltip` | Hover tooltip |

### Navigation
| Component | Description |
|-----------|-------------|
| `accordion` | Expandable/collapsible sections |
| `tabs` | Tab navigation |
| `pagination` | Page navigation |
| `dropdown-menu` | Dropdown menu with items |

### Overlay
| Component | Description |
|-----------|-------------|
| `dialog` | Modal dialog |
| `popover` | Floating popover |
| `sheet` | Slide-out panel |

### Data Display
| Component | Description |
|-----------|-------------|
| `avatar` | User avatar with fallback |
| `table` | Data table |
| `calendar` | Date picker calendar |
| `sortable` | Drag & drop sortable list |

## Color System

Colors are defined as CSS variables in `src/styles/globals.css` and support light/dark themes.

### Semantic Colors

```css
--background    /* Page background */
--foreground    /* Default text color */
--card          /* Card background */
--card-foreground
--popover       /* Popover background */
--popover-foreground
--primary       /* Primary actions */
--primary-foreground
--secondary     /* Secondary actions */
--secondary-foreground
--muted         /* Muted backgrounds */
--muted-foreground
--accent        /* Accent highlights */
--accent-foreground
--destructive   /* Error/delete actions */
--destructive-foreground
--border        /* Border color */
--input         /* Input border */
--ring          /* Focus ring */
```

### Brand Colors

| Token | Base Value | Usage |
|-------|------------|-------|
| **Primary** | `#35aff4` (Blue) | Main actions, links, primary buttons |
| **Secondary** | `#fa7436` (Orange) | CTAs, highlights, call-to-action buttons |
| **Tertiary** | `#b21589` (Purple/Pink) | Accents, special highlights |
| **Green** | `#9bd7c0` | Success states, confirmations |
| **Yellow** | `#fbbf00` | Warnings, star ratings |

### Color Scales

Each brand color has a full scale (5, 10, 20, 50, 100-900):

```css
/* Example: Primary Blue */
--primary-5: #f0f9ff
--primary-10: #e0f2fe
--primary-50: #38bdf8
--primary-100: #35aff4
--primary-500: #0284c7
--primary-900: #0c4a6e

/* Neutrals */
--dark-*     /* Dark grays */
--gray-*     /* Mid grays */
--light-*    /* Light grays */
--white-*    /* Off-whites */
```

## Typography

### Font Families

| Variable | Font | Usage |
|----------|------|-------|
| `font-roboto` | Roboto | Primary font |
| `--font-sans` | Inter | Fallback sans-serif |
| `--font-serif` | Source Serif 4 | Serif text |
| `--font-mono` | JetBrains Mono | Code blocks |

### Font Weights

- **300** - Light
- **400** - Regular
- **500** - Medium
- **700** - Bold

### Usage

```tsx
<p className="font-roboto font-medium">Medium weight text</p>
<code className="font-mono">Code snippet</code>
```

## Spacing & Sizing

### Border Radius

Based on `--radius` variable (default: `0.5rem` / 8px):

| Class | Value |
|-------|-------|
| `rounded-lg` | `var(--radius)` |
| `rounded-md` | `calc(var(--radius) - 2px)` |
| `rounded-sm` | `calc(var(--radius) - 4px)` |

### Shadows

Extended shadow scale with CSS variables:

| Class | Description |
|-------|-------------|
| `shadow-2xs` | Extra extra small |
| `shadow-xs` | Extra small |
| `shadow-sm` | Small |
| `shadow-md` | Medium |
| `shadow-lg` | Large |
| `shadow-xl` | Extra large |
| `shadow-2xl` | Extra extra large |

Custom shadows:
- `shadow-custom-blue` - Blue glow effect
- `shadow-custom-gray` - Gray glow effect

## Theming

### Dark Mode

Dark mode uses the `class` strategy. Toggle by adding/removing `dark` class on the root element.

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

### CSS Variables

All colors use HSL format with CSS variables for runtime theming:

```css
/* Light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 217.2 91% 60%;
}

/* Dark theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91% 60%;
}
```

## Animations

### Tailwind Animate Plugin

Standard animation utilities from `tailwindcss-animate`:
- `animate-in` / `animate-out`
- `fade-in` / `fade-out`
- `zoom-in` / `zoom-out`
- `slide-in-from-*` / `slide-out-to-*`

### Custom Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| `shimmer` | 2s infinite | Loading states |
| `chatbot-bounce` | - | Chatbot widget |
| `slideInUp` | - | Chatbot entrance |
| `messageAppear` | - | Chat messages |

## Utility Classes

### Layout

```css
.full-bleed    /* Break out of container to full width */
```

### Scrollbar

```css
.custom-scrollbar   /* Styled scrollbar */
.hide-scrollbar     /* Hidden scrollbar */
```

## File Structure

```
src/
├── styles/
│   ├── globals.css      # CSS variables, base styles
│   ├── admin.css        # Admin-specific styles
│   └── chatbot.css      # Chatbot widget styles
├── components/
│   └── ui/              # UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
└── app/
    └── layout.tsx       # Font configuration
```

## Usage Examples

### Button Variants

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Form with Validation

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="email@example.com" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```
