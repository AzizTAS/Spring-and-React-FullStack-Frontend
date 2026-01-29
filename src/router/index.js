import {createBrowserRouter } from "react-router-dom";

import { Home } from "@/pages/Home";
import { SignUp } from "@/pages/SignUp";
import App from "@/App";
import { Activation } from "@/pages/Activation";
import { User } from "@/pages/User";
import { Login } from "@/pages/Login";
import { PasswordResetRequest } from "@/pages/PasswordReset/Request";
import { SetPassword } from "@/pages/PasswordReset/SetPassword";
import { Products } from "@/pages/Products";
import { ProductDetail } from "@/pages/Products/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Orders } from "@/pages/Orders";
import { OrderDetail } from "@/pages/Orders/OrderDetail";
import { Admin } from "@/pages/Admin";
import { Payment } from "@/pages/Payment";

export default createBrowserRouter([
    {
      path: "/",
      Component: App,
      children: [
        {
          path: "/",
          index: true,
          Component: Home,
        },
        {
          path: "/signup",
          Component: SignUp
        },
        {
          path: "/activation/:token",
          Component: Activation
        },
        {
          path: "/user/:id",
          Component: User
        },
        {
          path: '/login',
          Component: Login
        },
        {
          path: "/password-reset/request",
          Component: PasswordResetRequest
        },
        {
          path: "/password-reset/set",
          Component: SetPassword
        },
        {
          path: "/products",
          Component: Products
        },
        {
          path: "/products/:id",
          Component: ProductDetail
        },
        {
          path: "/cart",
          Component: Cart
        },
        {
          path: "/orders",
          Component: Orders
        },
        {
          path: "/orders/:id",
          Component: OrderDetail
        },
        {
          path: "/admin",
          Component: Admin
        },
        {
          path: "/payment/:orderId",
          Component: Payment
        },
      ]
    }
  ])