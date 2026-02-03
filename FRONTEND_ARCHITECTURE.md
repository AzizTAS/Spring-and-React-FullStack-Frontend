# Frontend Architecture Documentation

## 🏗 Architecture Overview
The frontend follows a component-based architecture with React, using a hybrid state management approach (Context API + Redux Toolkit) and modular page structure.

```
Pages → Components → Hooks → State Management → API Services
```

## 📦 Folder Structure

### 1. Pages (`src/pages/`)
**Purpose**: Top-level page components, each representing a route

#### Admin Module (`Admin/`)
**Purpose**: Admin dashboard and management panels

**Structure**:
```
Admin/
├── index.jsx                    // Main admin page wrapper
└── components/
    ├── AdminDashboard.jsx      // Dashboard with stats and tabs
    ├── ProductManagement.jsx   // Product CRUD interface
    ├── CategoryManagement.jsx  // Category CRUD interface
    ├── UserManagement.jsx      // User management panel
    └── api.js                  // Admin API calls
```

**AdminDashboard Component**:
```javascript
Features:
- Statistics cards (users, products, orders)
- Tab navigation (Dashboard, Orders, Products, Categories, Users)
- Order list with status update dropdown
- Order deletion with confirmation
- Pagination for orders
- Role-based access control (ADMIN only)

State Management:
- activeTab: Current tab selection
- stats: Statistics data
- orders: Order list with pagination
- loading: Loading state
- error: Error messages

API Calls:
- getAdminStats() → Get user/product/order counts
- getAllOrders(page) → Get all orders (paginated)
- updateOrderStatus(id, status) → Update order status
- deleteOrder(id) → Delete order (cascade)
```

**ProductManagement Component**:
```javascript
Features:
- Product list table with image, name, category, price, stock
- Add new product modal
- Edit product modal
- Delete product with confirmation
- Category dropdown selection
- Image URL input
- Pagination

CRUD Operations:
- Create: Opens modal → Fill form → POST /api/v1/products
- Read: GET /api/v1/products (paginated)
- Update: Click edit → Modify form → PUT /api/v1/products/{id}
- Delete: Click delete → Confirm → DELETE /api/v1/products/{id}
```

**UserManagement Component**:
```javascript
Features:
- User list table with profile image, username, email, role
- Role dropdown (USER/ADMIN) for each user
- Delete user button
- Prevent self-deletion (disabled for current admin)
- Prevent role change for self
- Visual indicator for current user (blue background)
- Pagination

Key Functions:
- handleRoleChange(userId, newRole) → Update user role
- handleDelete(userId) → Delete user (cascade delete cart + orders)
```

---

#### Cart Module (`Cart/`)
**Purpose**: Shopping cart page

**Files**:
```
Cart/
├── index.jsx              // Main cart page
└── components/
    ├── CartList.jsx      // Cart items list
    ├── CartItem.jsx      // Individual cart item
    └── api.js            // Cart API calls
```

**CartList Component**:
```javascript
Features:
- Display all cart items
- Update quantity (+ / - buttons)
- Remove item from cart
- Calculate total price
- "Proceed to Checkout" button → Navigate to order creation
- Empty cart message

State:
- cart: { items: [], total: 0 }
- loading: Loading state

API Calls:
- getCart() → GET /api/v1/cart
- updateQuantity(itemId, quantity) → PUT /api/v1/cart/item/{id}
- removeItem(itemId) → DELETE /api/v1/cart/item/{id}

Price Calculation:
total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
```

---

#### Home Module (`Home/`)
**Purpose**: Homepage with user list

**Files**:
```
Home/
├── index.jsx              // Main homepage
└── components/
    ├── UserList.jsx      // User list component
    ├── UserListItem.jsx  // Individual user card
    └── api.js            // User list API
```

**UserList Component**:
```javascript
Features:
- Display users in card grid
- Pagination (previous/next)
- Profile image or initial circle
- Click user → Navigate to profile

Layout:
- Bootstrap grid (responsive)
- Card-based design
- Centered pagination controls
```

---

#### Login Module (`Login/`)
**Purpose**: User login page

**Files**:
```
Login/
├── index.jsx              // Login form
└── api.js                // Login API
```

**Login Flow**:
```javascript
1. User enters email + password
2. Submit → POST /api/v1/auth
3. Response: { token: "jwt...", user: {...} }
4. Store token in cookie (HTTP-only)
5. Update auth state (Context API)
6. Redirect to homepage
```

**Form Validation**:
- Email format validation
- Password required
- Show error messages from API

---

#### Orders Module (`Orders/`)
**Purpose**: Order history and details

**Structure**:
```
Orders/
├── index.jsx              // Orders list page
├── OrderDetail/
│   └── index.jsx         // Single order detail page
└── components/
    ├── OrderList.jsx     // Order list component
    └── api.js            // Order API calls
```

**OrderList Component**:
```javascript
Features:
- Display user's orders
- Order status badges (color-coded)
- Click order → Navigate to detail page
- Pagination
- Empty state message

Status Colors:
- PENDING: warning (yellow)
- CONFIRMED: info (blue)
- SHIPPED: primary (blue)
- DELIVERED: success (green)
- CANCELLED: danger (red)
```

**OrderDetail Component**:
```javascript
Features:
- Order information (ID, date, status, total)
- Shipping address
- Order items list (product, quantity, price)
- Cancel order button (if status allows)
- Back to orders button

Cancel Order:
- Only available for PENDING/CONFIRMED status
- Confirmation dialog
- PUT /api/v1/orders/{id}/status → status: CANCELLED
```

---

#### Products Module (`Products/`)
**Purpose**: Product catalog and detail pages

**Structure**:
```
Products/
├── index.jsx              // Products list page
├── ProductDetail/
│   └── index.jsx         // Single product page
└── components/
    ├── ProductList.jsx   // Product grid
    ├── ProductCard.jsx   // Individual product card
    └── api.js            // Product API
```

**ProductList Component**:
```javascript
Features:
- Product grid (responsive)
- Search bar (keyword search)
- Category filter dropdown
- Pagination
- Click product → Navigate to detail

Search/Filter:
- Search: Debounced input → GET /api/v1/products/search?keyword=...
- Category: Dropdown → GET /api/v1/products/category/{id}

URL Parameters:
- ?search=keyword → Auto-load search results
- ?category=id → Auto-load category filter
```

**ProductDetail Component**:
```javascript
Features:
- Product image (large)
- Product name, description
- Price display
- Stock availability
- "Add to Cart" button
- Quantity selector (1-10)
- Product reviews section
- Add review form (if authenticated)
- Average rating display

Add to Cart Flow:
1. Select quantity
2. Click "Add to Cart"
3. POST /api/v1/cart/add → { productId, quantity }
4. Show success toast
5. Update cart icon badge in navbar
```

---

#### SignUp Module (`SignUp/`)
**Purpose**: User registration

**Files**:
```
SignUp/
├── index.jsx              // Registration form
└── api.js                // Registration API
```

**Registration Flow**:
```javascript
1. User fills form:
   - Username (min 4 chars)
   - Email (valid format)
   - Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
   - Password repeat (must match)
2. Submit → POST /api/v1/users
3. Backend sends activation email
4. Show success message: "Check your email for activation"
5. User clicks activation link in email
6. PATCH /api/v1/users/{token}/active
7. Account activated → Can login
```

**Form Validation**:
- Client-side: React state validation
- Server-side: Bean Validation annotations
- Real-time feedback (input onChange)
- Error messages below inputs

---

#### User Module (`User/`)
**Purpose**: User profile page

**Structure**:
```
User/
├── index.jsx              // Main profile page
├── api.js                // User API
└── components/
    └── ProfileCard/
        ├── index.jsx              // Profile display
        ├── UserEditForm.jsx      // Edit profile form
        └── UserDeleteButton/
            ├── index.jsx          // Delete account button
            ├── api.js            // Delete API
            └── useUserDeleteButton.js  // Delete logic hook
```

**ProfileCard Component**:
```javascript
Features:
- Profile image (large) or initial circle
- Username, email
- Edit button (only for own profile)
- Delete button (only for own profile)
- View-only mode for other users

Edit Mode:
- Toggle edit form
- Update username, email, image
- PUT /api/v1/users/{id}
- Authorization check: @PreAuthorize("#id == principal.id")
```

---

#### Password Reset Module (`PasswordReset/`)
**Purpose**: Password reset flow

**Structure**:
```
PasswordReset/
├── Request/
│   ├── index.jsx          // Request reset page
│   ├── api.js            // Request API
│   └── usePasswordResetRequest.js  // Request logic
└── SetPassword/
    ├── index.jsx          // Set new password page
    ├── api.js            // Set password API
    └── useSetPassword.js  // Set password logic
```

**Reset Flow**:
```javascript
1. User clicks "Forgot Password"
2. Enter email → POST /api/v1/users/password-reset
3. Backend sends email with reset link
4. User clicks link → /password-reset/set?tk={token}
5. Enter new password + confirm
6. PATCH /api/v1/users/{token}/password
7. Password updated → Redirect to login
```

---

### 2. Shared Components (`src/shared/components/`)
**Purpose**: Reusable UI components

#### Alert.jsx
```javascript
Props:
- styleType: "success" | "danger" | "warning" | "info"
- center: boolean (center text)
- children: message content

Usage:
<Alert styleType="success">Operation successful</Alert>
```

#### Button.jsx
```javascript
Props:
- loading: boolean (show spinner)
- disabled: boolean
- onClick: function
- children: button text

Features:
- Disabled state when loading
- Spinner overlay during loading
- Bootstrap button styles
```

#### Input.jsx
```javascript
Props:
- label: string
- type: text | password | email
- error: string (validation error)
- value: string
- onChange: function

Features:
- Label with red asterisk if required
- Error message below input
- Red border on error
```

#### NavBar/index.jsx
```javascript
Features:
- Logo/brand name
- Navigation links:
  - Home
  - Products
  - Cart (with item count badge)
  - Orders (if authenticated)
  - Admin Panel (if ADMIN role)
- User menu (dropdown):
  - Profile
  - Logout
- Login/SignUp buttons (if not authenticated)
- Language selector (EN/TR)
- Responsive mobile menu (hamburger)

Cart Badge:
- Shows total items in cart
- Real-time update after add/remove
- Red badge with number
```

#### LanguageSelector.jsx
```javascript
Features:
- Dropdown with flag icons
- English / Turkish
- Stores selection in localStorage
- Triggers i18n language change
- Updates all translated strings
```

#### Spinner.jsx
```javascript
Usage:
- Loading indicators
- Center screen or inline
- Bootstrap spinner animation
```

#### Toast.jsx
```javascript
Features:
- Success/error/warning/info messages
- Auto-dismiss after 3 seconds
- Top-right position
- Stack multiple toasts
- Close button

Usage:
const { addToast } = useToast();
addToast("Item added to cart!", "success");
```

---

### 3. Custom Hooks (`src/shared/hooks/`)

#### useRouteParamApiRequest.js
```javascript
Purpose: Fetch data based on route parameter

Example:
const { data, loading, error } = useRouteParamApiRequest(
  "id",           // URL param name
  (id) => getUser(id)  // API function
);

Use Cases:
- User profile page (fetch by user ID)
- Product detail page (fetch by product ID)
- Order detail page (fetch by order ID)
```

---

### 4. State Management (`src/shared/state/`)

#### context.jsx
**Purpose**: Global authentication state

```javascript
AuthContext provides:
- authState: { id, username, email, image, role }
- dispatch: Update auth state
- setUser(): Set authenticated user
- logout(): Clear auth state

Usage:
const authState = useAuthState();
const dispatch = useAuthDispatch();

if (authState.role === "ADMIN") {
  // Show admin features
}
```

#### redux.js
**Purpose**: Redux Toolkit slices (optional future use)

Current Status: Minimal implementation
Future: Can add slices for cart, products, etc.

#### storage.js
**Purpose**: LocalStorage wrapper

```javascript
Functions:
- setItem(key, value)
- getItem(key)
- removeItem(key)

Usage:
storage.setItem("language", "en");
const lang = storage.getItem("language");
```

---

### 5. API Integration (`src/lib/http.js`)

**Purpose**: Axios HTTP client configuration

```javascript
Features:
- Base URL: Backend API endpoint
- Request interceptor: Add Authorization header (JWT token from cookie)
- Response interceptor: Handle 401 (auto logout on token expiry)
- Error handling: Extract error messages
- CORS credentials: true (send cookies)

Configuration:
const http = axios.create({
  baseURL: process.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true
});

// Request interceptor
http.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired → Logout
      dispatch({ type: "logout" });
      navigate("/login");
    }
    return Promise.reject(error);
  }
);
```

---

### 6. Internationalization (`src/locales/`)

**Structure**:
```
locales/
├── index.js           // i18n configuration
└── translations/
    ├── en.json       // English translations
    └── tr.json       // Turkish translations
```

**i18n Setup**:
```javascript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import tr from "./translations/tr.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr }
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });
```

**Usage**:
```javascript
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

**Translation Keys**:
```json
{
  "welcome": "Welcome",
  "addToCart": "Add to Cart",
  "checkout": "Proceed to Checkout",
  "orderPlaced": "Order placed successfully!",
  "confirmDeleteUser": "Are you sure you want to delete this user?"
}
```

---

### 7. Routing (`src/router/index.js`)

**Route Structure**:
```javascript
createBrowserRouter([
  {
    path: "/",
    Component: App,  // Main layout wrapper
    children: [
      { path: "/", index: true, Component: Home },
      { path: "/signup", Component: SignUp },
      { path: "/activation/:token", Component: Activation },
      { path: "/login", Component: Login },
      { path: "/user/:id", Component: User },
      { path: "/password-reset/request", Component: PasswordResetRequest },
      { path: "/password-reset/set", Component: SetPassword },
      { path: "/products", Component: Products },
      { path: "/products/:id", Component: ProductDetail },
      { path: "/cart", Component: Cart },
      { path: "/orders", Component: Orders },
      { path: "/orders/:id", Component: OrderDetail },
      { path: "/admin", Component: Admin },  // Protected: ADMIN only
      { path: "/payment/:orderId", Component: Payment }
    ]
  }
]);
```

**Protected Routes**:
- Check `authState.role` in component
- Redirect to login if not authenticated
- Redirect to home if not authorized (e.g., non-admin trying to access /admin)

---

## 🎨 Styling Approach

### Bootstrap 5
- Grid system for responsive layouts
- Utility classes (mt-3, p-4, text-center, etc.)
- Components (card, button, navbar, modal, etc.)

### Custom SCSS (`src/styles.scss`)
```scss
// Custom variables
$primary-color: #007bff;
$danger-color: #dc3545;

// Component-specific styles
.product-card {
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: $danger-color;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}
```

---

## 🔄 Data Flow

### Example: Add to Cart
```
1. User clicks "Add to Cart" on ProductDetail
   ↓
2. ProductDetail calls addToCart(productId, quantity)
   ↓
3. API call: POST /api/v1/cart/add { productId, quantity }
   ↓
4. Backend:
   - Validates product exists
   - Finds/creates user's cart
   - Adds/updates cart item
   - Returns updated cart
   ↓
5. Frontend:
   - Shows success toast
   - Updates cart badge count in navbar
   - Could update cart state (if using Context/Redux)
```

---

## 📱 Responsive Design

### Breakpoints (Bootstrap)
- xs: < 576px (mobile)
- sm: ≥ 576px (tablet)
- md: ≥ 768px (tablet landscape)
- lg: ≥ 992px (desktop)
- xl: ≥ 1200px (large desktop)

### Mobile Optimizations
- Hamburger menu for navigation
- Collapsible filters
- Stack cards vertically
- Touch-friendly buttons (min 44px)
- Responsive images (max-width: 100%)

---

## 🚀 Performance Optimizations

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Memoization**: React.memo() for expensive components
3. **Debouncing**: Search input debounce (500ms)
4. **Pagination**: Load data in chunks
5. **Image Optimization**: Lazy loading, compressed images
6. **Bundle Size**: Tree-shaking, production build minification

---

## 🧪 Testing Strategy

### Recommended Tests
1. **Unit Tests**: Component logic, utility functions
2. **Integration Tests**: API calls, form submissions
3. **E2E Tests**: Critical user flows (registration → purchase)

### Tools
- **Vitest**: Unit/integration testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing

---

## 📊 Best Practices Implemented

1. ✅ **Component-Based Architecture**: Reusable, maintainable components
2. ✅ **Custom Hooks**: Encapsulate reusable logic
3. ✅ **Error Handling**: Try-catch with user-friendly messages
4. ✅ **Loading States**: Spinners during async operations
5. ✅ **Form Validation**: Client + server-side validation
6. ✅ **Responsive Design**: Mobile-first approach
7. ✅ **Internationalization**: Multi-language support
8. ✅ **Security**: No sensitive data in localStorage, HTTP-only cookies
9. ✅ **SEO**: Semantic HTML, proper headings
10. ✅ **Accessibility**: ARIA labels, keyboard navigation

---

## 🔐 Security Considerations

1. **JWT Storage**: HTTP-only cookies (not localStorage)
2. **XSS Prevention**: React escapes by default
3. **CSRF Protection**: SameSite cookie attribute
4. **Input Sanitization**: Server-side validation
5. **Role-Based UI**: Hide admin features from regular users
6. **Token Expiration**: Auto-logout on 401 response
