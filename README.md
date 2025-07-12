# Pizza Palace - Domino's Style Pizza Ordering System

A modern, responsive pizza ordering application built with vanilla JavaScript, featuring a beautiful UI similar to Domino's Pizza with comprehensive functionality.

## 🚀 Features

### 🍕 **Core Functionality**
- **Product Catalog**: Browse pizzas, sides, beverages, and desserts
- **Pizza Customization**: Size, crust type, and toppings selection
- **Smart Cart Management**: Add, remove, update quantities with persistence
- **Secure Payment**: Integrated Razorpay payment gateway
- **Order Tracking**: Real-time order status with visual progress
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🎨 **User Interface**
- **Modern Design**: Clean, intuitive interface inspired by Domino's
- **Smooth Animations**: Enhanced user experience with CSS animations
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Accessible**: Proper ARIA labels and keyboard navigation support

### 🛒 **Shopping Cart**
- **Sidebar Cart**: Slide-out cart for easy access
- **Real-time Updates**: Live cart count and total calculation
- **Quantity Controls**: Easy increase/decrease quantity buttons
- **Customization Display**: Clear display of pizza customizations
- **Persistent Storage**: Cart data saved to localStorage

### 🛍️ **Product Categories**
- **Pizzas**: Customizable with size, crust, and toppings
- **Sides**: Garlic bread, breadsticks, wings
- **Beverages**: Soft drinks, fresh juices, lassi
- **Desserts**: Brownies, tiramisu, and more

### 💳 **Payment & Checkout**
- **Secure Payment**: Razorpay integration for safe transactions
- **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- **Order Confirmation**: Automatic order confirmation and tracking
- **Tax Calculation**: Automatic GST calculation (18%)
- **Delivery Charges**: Free delivery on orders above ₹500

### 📱 **Order Management**
- **Order History**: Track all past orders
- **Real-time Status**: Live order tracking with progress indicators
- **Estimated Delivery**: Dynamic delivery time calculation
- **Order Details**: Complete order breakdown and receipt

## 🏗️ **Technical Architecture**

### **Frontend Structure**
```
Pizza Palace/
├── index.html                 # Main HTML file
├── styles/
│   └── main.css              # Custom CSS styles
├── scripts/
│   ├── controllers/          # MVC Controllers
│   │   ├── product-controller.js
│   │   ├── cart-controller.js
│   │   └── ui-controller.js
│   ├── services/             # Business Logic
│   │   ├── api-client.js
│   │   ├── cart-service.js
│   │   ├── payment.js
│   │   └── product-operations.js
│   ├── models/               # Data Models
│   │   └── product.js
│   └── utils/                # Utilities
│       └── constant.js
└── README.md
```

### **Key Technologies**
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3, Custom CSS with CSS Variables
- **Icons**: Font Awesome 6.4
- **Payment**: Razorpay Payment Gateway
- **Storage**: LocalStorage for cart and order persistence
- **Architecture**: MVC Pattern with modular design

## 🚀 **Getting Started**

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for CDN resources
- Python 3.x (for local development server)

### **Installation**
1. Clone or download the repository
2. Navigate to the project directory
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and visit `http://localhost:8000`

### **Usage**
1. **Browse Products**: Navigate through different categories
2. **Add to Cart**: Click "Add" for simple items or "Customize" for pizzas
3. **Customize Pizza**: Select size, crust, and toppings
4. **View Cart**: Click the cart icon to review your order
5. **Checkout**: Proceed to payment when ready
6. **Track Order**: Use the "Track Order" button to see delivery progress

## 🔧 **Configuration**

### **Payment Gateway**
Update the Razorpay configuration in `scripts/services/payment.js`:
```javascript
"key": "your_razorpay_key_here", // Replace with your Razorpay key
```

### **API Endpoint**
Update the API URL in `scripts/utils/constant.js`:
```javascript
const URL = 'your_api_endpoint_here';
```

## 📋 **Features Breakdown**

### **Pizza Customization**
- **Sizes**: Small (8"), Medium (12"), Large (16")
- **Crusts**: Thin, Thick, Cheese Stuffed
- **Toppings**: Extra Cheese, Mushrooms, Pepperoni, Olives, Bell Peppers, Onions

### **Cart Features**
- Automatic price calculation with customizations
- Quantity controls with validation
- Remove items functionality
- Clear entire cart option
- Persistent cart across sessions

### **Payment Integration**
- Secure Razorpay integration
- Multiple payment methods support
- Automatic order confirmation
- Payment failure handling
- Order receipt generation

### **Order Tracking**
- 5-step tracking process:
  1. Order Placed
  2. Preparing
  3. Baking
  4. Out for Delivery
  5. Delivered
- Real-time progress visualization
- Estimated delivery time calculation

## 🎯 **Key Selling Points**

### **Like Domino's Experience**
- **Professional Design**: Modern, clean interface
- **Fast Loading**: Optimized for quick page loads
- **Mobile Responsive**: Perfect on all devices
- **Intuitive Navigation**: Easy to find and order items

### **Enhanced Features**
- **Smart Cart**: Remembers customizations and quantities
- **Visual Feedback**: Animations and confirmations
- **Error Handling**: Graceful error messages and recovery
- **Performance**: Efficient loading and smooth interactions

### **Business Ready**
- **Scalable Architecture**: Easy to extend and maintain
- **SEO Friendly**: Proper HTML structure and meta tags
- **Analytics Ready**: Easy to integrate tracking
- **Production Ready**: Optimized for deployment

## 🛡️ **Security Features**
- Input validation and sanitization
- Secure payment processing
- XSS protection
- CSRF prevention measures
- Data encryption for sensitive information

## 🔄 **Browser Compatibility**
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 **Mobile Features**
- Touch-friendly interface
- Responsive design
- Mobile-optimized cart
- Swipe gestures support
- Mobile payment integration

## 🎨 **Design Features**
- **Color Scheme**: Professional blue and orange
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent margins and padding
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant design

## 🚀 **Performance Optimizations**
- Lazy loading for images
- Minified CSS and JavaScript
- CDN usage for external libraries
- Efficient DOM manipulation
- Optimized API calls

## 📊 **Analytics & Tracking**
Ready for integration with:
- Google Analytics
- Facebook Pixel
- Custom event tracking
- Conversion tracking
- User behavior analysis

## 🔧 **Customization Options**
- Easy theme customization with CSS variables
- Configurable product categories
- Adjustable pricing and tax rates
- Customizable delivery charges
- Flexible payment options

## 📞 **Support**
For technical support or feature requests, please refer to the code comments or create an issue in the repository.

---

**Built with ❤️ for pizza lovers everywhere!** 🍕

*This application demonstrates modern web development practices with a focus on user experience, performance, and maintainability.*