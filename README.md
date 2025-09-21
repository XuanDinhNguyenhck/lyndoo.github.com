# LynDoo shop

A modern, responsive gallery website showcasing creative works including photography, videos, and digital art. Built with a beautiful theme system using OKLCH color space for consistent and accessible design.

## Features

### 🎨 Design & Theming
- **Custom Theme System**: Based on your provided CSS variables with OKLCH colors
- **Dark/Light Mode**: Seamless theme switching with persistent user preference
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Modern Typography**: Uses Google Fonts (Delius Swash Caps, Source Serif 4, JetBrains Mono)

### 🖼️ Gallery Features
- **Filtering System**: Filter by categories (Photography, Videos, Digital Art, Nature, Portraits)
- **Search Functionality**: Real-time search through titles, descriptions, and categories
- **Modal Viewer**: Full-screen image and video viewing experience
- **Lazy Loading**: Optimized image loading for better performance
- **Load More**: Progressive loading of gallery items

### 🚀 Interactive Elements
- **Smooth Animations**: CSS animations with intersection observer for scroll effects
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Form Handling**: Contact form with validation and submission feedback
- **Parallax Effects**: Subtle parallax scrolling for enhanced visual appeal

### 📱 Mobile Experience
- **Touch-Friendly**: Optimized for touch interactions
- **Mobile Menu**: Collapsible navigation for mobile devices
- **Responsive Grid**: Adaptive gallery layout for all screen sizes
- **Fast Loading**: Optimized for mobile performance

## Project Structure

```
LynDoo/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css         # All styles with theme system
│   ├── js/
│   │   └── script.js         # Interactive functionality
│   └── images/               # Image assets folder
└── README.md                 # This file
```

## Theme System

The website uses a comprehensive CSS custom property system with:

- **Light Theme**: Warm, natural colors with green accents
- **Dark Theme**: Modern dark interface with consistent contrast
- **Color Variables**: Semantic naming for easy maintenance
- **Typography**: Three font families for different use cases
- **Shadows**: Consistent shadow system for depth
- **Borders**: Unified border radius and spacing

### Key Theme Variables

```css
:root {
  --background: oklch(0.8798 0.0534 91.7893);
  --foreground: oklch(0.4265 0.0310 59.2153);
  --primary: oklch(0.6657 0.1050 118.9078);
  --card: oklch(0.8937 0.0395 87.5676);
  /* ... and many more */
}
```

## How to Use

1. **Open the Website**: Simply open `index.html` in a web browser
2. **Browse Gallery**: Use filters or search to find specific content
3. **View Items**: Click on gallery items to open them in full-screen modal
4. **Switch Themes**: Use the theme toggle button in the navigation
5. **Contact**: Fill out the contact form to get in touch

## Customization

### Adding New Gallery Items

Add new items to the gallery by inserting HTML in the `.gallery-grid` section:

```html
<div class="gallery-item" data-category="your-category">
    <div class="gallery-card">
        <img src="your-image.jpg" alt="Description" loading="lazy">
        <div class="gallery-overlay">
            <div class="gallery-info">
                <h3>Your Title</h3>
                <p>Your description</p>
                <span class="gallery-category">Category</span>
            </div>
            <button class="gallery-btn" onclick="openModal(this)" 
                    data-title="Your Title" 
                    data-description="Full description" 
                    data-src="your-large-image.jpg">
                <i class="fas fa-expand"></i>
            </button>
        </div>
    </div>
</div>
```

### Modifying Colors

Update the CSS custom properties in `:root` and `.dark` selectors to change the color scheme:

```css
:root {
  --primary: your-new-primary-color;
  --background: your-new-background-color;
  /* Update other variables as needed */
}
```

### Adding New Categories

1. Add filter button to `.filter-controls`:
```html
<button class="filter-btn" data-filter="new-category">New Category</button>
```

2. Add the category to gallery items:
```html
<div class="gallery-item" data-category="new-category">
```

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **CSS Features**: CSS Grid, Flexbox, Custom Properties, OKLCH colors
- **JavaScript**: ES6+ features, Intersection Observer API
- **Responsive**: Works on all device sizes

## Performance Features

- **Lazy Loading**: Images load only when needed
- **Debounced Search**: Optimized search performance
- **Efficient Animations**: GPU-accelerated CSS animations
- **Minimal Dependencies**: Only Font Awesome icons externally loaded

## Accessibility

- **Semantic HTML**: Proper heading structure and landmarks
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Proper focus handling in modals

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- **Design**: Custom theme based on provided CSS variables
- **Images**: Sample images from Unsplash (replace with your own)
- **Icons**: Font Awesome icons
- **Fonts**: Google Fonts (Delius Swash Caps, Source Serif 4, JetBrains Mono)

---

Built with ❤️ for showcasing creative works without the complexity of e-commerce functionality.