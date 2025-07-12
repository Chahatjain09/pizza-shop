# 🍕 Dominos Pizza - Online Ordering System

A modern, responsive pizza ordering application built with vanilla JavaScript, featuring a Dominos-style interface with full e-commerce functionality.

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse through a variety of delicious pizzas
- **Search & Filter**: Find your favorite pizza quickly with search and sorting options
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Cart**: Add, remove, and modify quantities in real-time
- **Dynamic Pricing**: Automatic total calculation with quantity support

### 💳 Payment Integration
- **Razorpay Integration**: Secure payment processing
- **Dynamic Amounts**: Payment amounts update automatically based on cart total
- **Success/Failure Handling**: Proper feedback for payment status
- **Cart Clearing**: Automatic cart clearing after successful payment

### 🎨 User Interface
- **Modern Design**: Clean, professional Dominos-inspired interface
- **Loading States**: Smooth loading animations and error handling
- **Success Messages**: User-friendly notifications for actions
- **Bootstrap Icons**: Beautiful iconography throughout the interface
- **Sticky Cart**: Cart stays visible while browsing products

### 🔧 Technical Features
- **Modular Architecture**: Clean separation of concerns with MVC pattern
- **Error Handling**: Comprehensive error handling and user feedback
- **API Integration**: Fetches pizza data from external API
- **Local Storage**: Cart persistence (can be extended)
- **Responsive Grid**: Bootstrap-based responsive layout

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd dominos-pizza-app
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
dominos-pizza-app/
├── index.html                 # Main HTML file
├── README.md                  # Project documentation
├── scripts/
│   ├── controllers/
│   │   └── product-controller.js    # Main controller for UI logic
│   ├── models/
│   │   └── product.js              # Product data model
│   ├── services/
│   │   ├── api-client.js           # API communication
│   │   ├── payment.js              # Payment processing
│   │   └── product-operations.js   # Business logic
│   └── utils/
│       └── constant.js             # Configuration constants
```

## 🛠️ Architecture

### MVC Pattern Implementation

- **Model** (`product.js`): Data structure for pizza products
- **View** (`index.html`): User interface and presentation
- **Controller** (`product-controller.js`): Business logic and user interaction handling

### Service Layer

- **API Client**: Handles external API communication
- **Product Operations**: Manages product data and cart operations
- **Payment Service**: Handles payment processing and integration

## 🎯 Key Functionality

### Product Management
- Load products from external API
- Display products in responsive grid
- Search and filter products
- Sort by name, price (low to high, high to low)

### Cart Operations
- Add products to cart
- Remove products from cart
- Update quantities (1-10 per item)
- Real-time total calculation
- Cart persistence

### Payment Processing
- Razorpay integration
- Dynamic payment amounts
- Success/failure handling
- Automatic cart clearing after payment

## 🎨 Customization

### Styling
The application uses CSS custom properties for easy theming:

```css
:root {
    --dominos-red: #E31837;
    --dominos-blue: #0066CC;
}
```

### Configuration
Update the API endpoint in `scripts/utils/constant.js`:
```javascript
const URL = 'https://raw.githubusercontent.com/Skill-risers/pizzajson/main/pizza.json';
```

### Payment Settings
Modify payment configuration in `scripts/services/payment.js`:
```javascript
"key": "your_razorpay_key_here",
"currency": "INR",
"name": "Your Business Name",
```

## 🔧 Development

### Adding New Features
1. Follow the existing MVC pattern
2. Add new services in the `services/` directory
3. Update controllers for new UI interactions
4. Maintain consistent error handling

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add proper error handling
- Include meaningful comments

## 🚀 Deployment

### Static Hosting
The application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Firebase Hosting

### Requirements
- HTTPS enabled (required for payment processing)
- CORS properly configured for API calls
- Valid Razorpay credentials

## 🐛 Troubleshooting

### Common Issues

1. **Products not loading**
   - Check internet connection
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Payment not working**
   - Ensure HTTPS is enabled
   - Verify Razorpay credentials
   - Check browser console for payment errors

3. **Cart not updating**
   - Refresh the page
   - Check for JavaScript errors in console
   - Verify all scripts are loading properly

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Pizza data provided by [Skill-risers](https://github.com/Skill-risers/pizzajson)
- UI framework: Bootstrap 5
- Icons: Bootstrap Icons
- Payment processing: Razorpay

---

**Enjoy your pizza! 🍕**