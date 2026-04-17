# Hoaxify — Frontend

React frontend for the Hoaxify e-commerce platform. Built with Vite, it covers the full shopping experience — browsing products, managing a cart, placing orders, and a basic admin dashboard. I also added bilingual support (Turkish and English) using i18next.

## Tech Stack

- React 18 + Vite 4
- React Router v6 for client-side routing
- Redux Toolkit for cart state
- React Context + useReducer for auth state
- Axios with a custom interceptor that attaches the auth token and language header to every request
- Bootstrap 5 + SCSS
- i18next (Turkish and English)

## Running Locally

```bash
git clone https://github.com/AzizTAS/Spring-and-React-FullStack-Frontend.git
cd Spring-and-React-FullStack-Frontend

npm install
npm run dev
```

App runs at `http://localhost:5173`. It expects the backend to be running at `http://localhost:8080` — see the [backend repo](https://github.com/AzizTAS/Spring-and-React-FullStack-Backend) for setup instructions.

## Project Structure

```
src/
├── pages/
│   ├── Login/          # Login page
│   ├── SignUp/         # Registration
│   ├── Activation/     # Email activation
│   ├── PasswordReset/  # Forgot password + set new password
│   ├── User/           # User profile
│   ├── Products/       # Product catalog + product detail
│   ├── Cart/           # Shopping cart
│   ├── Orders/         # Order history + order detail
│   ├── Payment/        # Checkout
│   ├── Admin/          # Admin dashboard
│   └── Home/           # Landing page
├── shared/
│   ├── components/     # NavBar, Alert, Input, Button, Toast, etc.
│   ├── hooks/          # Custom hooks
│   └── state/          # Auth context, reducer, localStorage helpers
├── lib/
│   └── http.js         # Axios instance with interceptor
├── locales/            # Translation files — TR + EN
└── router/             # Route definitions
```

## Features

- User registration with email activation link
- Login and logout with token-based auth
- Password reset via email
- Product catalog with category filtering
- Product detail page with customer reviews
- Shopping cart backed by Redux (state persists across navigation)
- Order history and order detail view
- Payment flow integrated with the backend
- Admin panel for managing users, products, and orders
- Language switcher — Turkish and English

## Authentication

Auth state lives in a React Context and is persisted to `localStorage`. When the user logs in, the token is stored and then attached to every outgoing Axios request:

```
Authorization: Bearer <prefix> <token>
```

On page refresh, the stored auth state is rehydrated from `localStorage` so the user stays logged in.

## Related

Backend: [Spring-and-React-FullStack-Backend](https://github.com/AzizTAS/Spring-and-React-FullStack-Backend)
