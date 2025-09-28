# ACL 2025 - Austin City Limits Group Trip

A modern, responsive web application for planning our group trip to Austin City Limits Music Festival 2025.

## 🚀 Features

- **Dark/Light Theme Toggle** - Automatic theme switching with user preference storage
- **Mobile-First Design** - Optimized for all devices
- **Dynamic Content Loading** - All data loaded from JSON files
- **Tab Navigation** - Schedule, Attendees, and Info sections
- **Modern Architecture** - Clean separation of concerns

## 📁 Project Structure

```
acl25/
├── index.html          # Main HTML structure
├── styles/
│   └── main.css        # All styling with CSS custom properties
├── js/
│   └── app.js          # Application logic and data loading
├── data/
│   └── events.json     # All event and attendee data
└── README.md           # This file
```

## 🛠️ Usage

1. **Serve the files** using a local web server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

2. **Open** `http://localhost:8000` in your browser

## ✏️ Updating Content

### Adding/Modifying Events
Edit `data/events.json`:
```json
{
  "schedule": [
    {
      "id": "day1",
      "title": "Day Title",
      "events": [
        {
          "time": "8:00 PM",
          "title": "Event Name", 
          "details": "Event details with links",
          "type": "meal|festival|nightlife|general"
        }
      ]
    }
  ]
}
```

### Adding/Modifying Attendees
Edit the `attendees` section in `data/events.json`:
```json
{
  "attendees": [
    {
      "name": "Name",
      "arrival": "Flight details",
      "departure": "Flight details", 
      "hotel": "Hotel name"
    }
  ]
}
```

### Updating Theme Colors
Modify CSS custom properties in `styles/main.css`:
```css
:root {
  --bg-primary: #your-color;
  --accent-blue: #your-color;
}
```

## 🎨 Theme System

The application uses CSS custom properties for theming:
- **Dark Theme**: Default, optimized for evening use
- **Light Theme**: Clean, professional appearance for daytime
- **Automatic Persistence**: User preference saved to localStorage

## 📱 Responsive Design

- Desktop: Full layout with sidebar navigation
- Tablet: Adapted layout with touch-friendly controls
- Mobile: Stack layout with optimized spacing

## 🔧 Technical Details

- **No Build Process** - Pure HTML, CSS, and JavaScript
- **Modern ES6+** - Classes, async/await, modules
- **Progressive Enhancement** - Works even if JavaScript fails
- **Accessibility** - Semantic HTML and ARIA labels
- **Performance** - Efficient rendering and caching

## 🚀 Deployment

Deploy to any static hosting service:
- **GitHub Pages**: Push to gh-pages branch
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **Firebase Hosting**: Use Firebase CLI

## 📄 License

This project is for personal use for our ACL 2025 group trip.