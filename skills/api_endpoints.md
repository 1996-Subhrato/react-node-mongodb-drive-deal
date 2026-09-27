# Drive Deal API Documentation

This document lists all the API endpoints available in the Drive Deal backend.

**Base URL**: `/api/v1`

---

## 1. Public APIs (`/api/v1`)
These endpoints are accessible to all users without authentication.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Render Index Page |
| `GET` | `/ping` | Health Check (Returns 'pong') |
| `GET` | `/cars` | Render Car List Page |
| `GET` | `/fetchCategories` | Fetch all car categories |
| `GET` | `/fetchcars/:id` | Fetch cars by category ID |
| `GET` | `/single_car/:id` | Render single car detail page |
| `GET` | `/fetchSingleCar/:id` | Fetch details for a specific car |
| `GET` | `/compareCar` | Render car comparison page |
| `GET` | `/about` | Render About Us page |
| `GET` | `/contact` | Render Contact page |
| `GET` | `/fetchreviews` | Fetch all reviews |

---

## 2. Admin APIs (`/api/v1/admin`)
Endpoints for administrative tasks. Most require `AdminToken` cookie.

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/login` | No | Render Admin Login Page |
| `POST` | `/login` | No | Authenticate Admin |
| `GET` | `/token` | Yes | Verify Admin Token |
| `GET` | `/dashboard` | Yes | Render Admin Dashboard |
| `GET` | `/manage_dealer` | Yes | Render Dealer Management Page |
| `GET` | `/fetchDealer` | Yes | Fetch all registered dealers |
| `PUT` | `/update_dealerstatus/:id` | Yes | Approve/Deactivate a dealer |
| `DELETE` | `/delete_dealer/:id` | Yes | Remove a dealer |
| `GET` | `/fetchUsers` | Yes | Fetch all registered users |
| `POST` | `/send-email` | Yes | Send administrative email |
| `GET` | `/manage_category` | Yes | Render Category Management Page |
| `POST` | `/add_category` | Yes | Create a new car category |
| `GET` | `/viewcategory` | Yes | List all categories |
| `PUT` | `/update_category/:id` | Yes | Edit category details |
| `DELETE` | `/delete_category/:id` | Yes | Remove a category |
| `GET` | `/changePassword` | Yes | Render password change page |
| `PUT` | `/changePassword` | Yes | Update admin password |
| `GET` | `/logout` | Yes | Admin Logout |
| `GET` | `/view_booking` | Yes | Render Bookings Management Page |
| `GET` | `/fetchbooking` | Yes | Fetch all rental bookings |

---

## 3. User APIs (`/api/v1/user`)
Endpoints for registered customers. Most require `UserToken` cookie.

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/signup` | No | Render User Signup Page |
| `GET` | `/login` | No | Render User Login Page |
| `POST` | `/register` | No | Create new User account |
| `POST` | `/login` | No | Authenticate User |
| `GET` | `/token` | Yes | Verify User Token |
| `GET` | `/dashboard` | Yes | Render User Dashboard |
| `GET` | `/stats` | Yes | Get personal usage statistics |
| `GET` | `/logout` | Yes | User Logout |
| `GET` | `/profile` | Yes | Render User Profile Page |
| `GET` | `/showProfile` | Yes | Fetch current user profile data |
| `PUT` | `/updateProfile/:id` | Yes | Update profile details |
| `GET` | `/changePassword` | Yes | Render password change page |
| `PUT` | `/changePassword` | Yes | Update user password |
| `POST` | `/addCarRequest` | Yes | Submit a request for a car |
| `PUT` | `/updateCar/:id` | Yes | Update car status (User side) |
| `GET` | `/thankyou` | Yes | Render Thank You Page |
| `GET` | `/mycars` | Yes | Render My Cars/Requests Page |
| `GET` | `/fetchMycars` | Yes | Fetch user's car requests |
| `POST` | `/addreview` | Yes | Submit a review for a car |
| `POST` | `/addBooking` | Yes | Create a new car booking |
| `GET` | `/fetchMyBookings` | Yes | Fetch user's booking history |

---

## 4. Dealer APIs (`/api/v1/dealer`)
Endpoints for car dealers/owners. Most require `DealerToken` cookie.

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/signup` | No | Render Dealer Signup Page |
| `GET` | `/login` | No | Render Dealer Login Page |
| `POST` | `/register` | No | Create new Dealer account |
| `POST` | `/login` | No | Authenticate Dealer |
| `GET` | `/token` | Yes | Verify Dealer Token |
| `GET` | `/dashboard` | Yes | Render Dealer Dashboard |
| `GET` | `/stats` | Yes | Get dealer business statistics |
| `GET` | `/logout` | Yes | Dealer Logout |
| `GET` | `/profile` | Yes | Render Dealer Profile Page |
| `GET` | `/showProfile` | Yes | Fetch current dealer profile data |
| `PUT` | `/updateProfile/:id` | Yes | Update profile details |
| `GET` | `/changePassword` | Yes | Render password change page |
| `PUT` | `/changePassword` | Yes | Update dealer password |
| `GET` | `/manage_car` | Yes | Render Car Management Page |
| `POST` | `/addcar` | Yes | List a new car for rent |
| `GET` | `/fetchcategories` | Yes | Fetch categories for car listing |
| `GET` | `/fetchcars` | Yes | Fetch cars owned by this dealer |
| `PUT` | `/updatecar/:id` | Yes | Edit car details |
| `DELETE` | `/deletecar/:id` | Yes | Remove a car listing |
| `GET` | `/car_req` | Yes | Render Incoming Car Requests Page |
| `GET` | `/fetchcarreq` | Yes | Fetch pending requests for cars |
| `PUT` | `/updatereq/:id` | Yes | Accept/Reject a car request |
| `GET` | `/view_approved_req` | Yes | Render Approved Bookings Page |
| `GET` | `/fetchapprovedbooking` | Yes | Fetch approved booking list |
| `GET` | `/view_cancelled_req` | Yes | Render Cancelled Bookings Page |
| `GET` | `/fetchcancelledbooking` | Yes | Fetch cancelled booking list |
| `GET` | `/view_completed_req` | Yes | Render Completed Bookings Page |
| `GET` | `/fetchcompletedbooking` | Yes | Fetch completed booking history |
| `POST` | `/send-email` | Yes | Send email to customers |
