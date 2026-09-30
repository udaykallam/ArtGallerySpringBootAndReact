````markdown
# 🎨 Aurelian Gallery

### Art Gallery Management & E-Commerce Platform

A full-stack Art Gallery Management System built with **Spring Boot, React, and MySQL**.

Aurelian Gallery provides a complete digital platform for customers, artists, and administrators to manage, showcase, purchase, and support artwork through a modern web application.

---

## ✨ Overview

Aurelian Gallery is designed as a role-based art marketplace where:

- 👤 Customers can browse and purchase artworks
- 🎨 Artists can upload and manage their artwork
- 🛡️ Administrators can manage users, artworks, categories, orders, and announcements
- 🔐 Users can securely authenticate using JWT or Google OAuth
- 📧 Email verification, password recovery, and account reactivation are supported
- 🛒 Customers can manage carts and wishlists
- ⭐ Customers can review artworks
- 📦 Orders can be tracked through their lifecycle
- 💬 Customers can communicate with support through support tickets
- 🔔 Users receive notifications for important account and order events

The application follows a layered backend architecture and a component-based React frontend.

---

# 🚀 Features

## 👤 Customer Features

### Authentication & Account

- User registration
- Email verification
- JWT-based authentication
- Google OAuth 2.0 login
- Forgot password
- OTP-based password reset
- Change password
- Account deactivation
- OTP-based account reactivation
- Protected routes
- Role-based authorization

### Artwork

- Browse artworks
- View artwork details
- Artwork search and filtering
- View artwork categories
- View artist information
- Artwork reviews
- Edit personal reviews
- Delete personal reviews

### Shopping

- Add artworks to cart
- Remove artworks from cart
- Manage wishlist
- Place orders
- View order history
- Track order status

### Notifications

- Real-time notifications
- Order notifications
- Account-related notifications
- Read/unread notification state

### Customer Support

- Create support tickets
- Select support categories
- Associate tickets with orders
- View previous support conversations
- Send messages to support
- Track ticket status
- FAQ assistant for common questions

---

# 🎨 Artist Features

Artists have access to a dedicated artist dashboard.

### Artwork Management

- Upload artwork
- Add artwork information
- Upload artwork images
- Edit artwork
- Manage artwork listings
- View artwork-related information

### Order Management

- View orders related to their artwork
- Track order status

---

# 🛡️ Admin Features

Administrators have access to a dedicated administration dashboard.

### User Management

- View users
- Manage customer accounts
- Manage artist accounts
- Enable/disable accounts
- Role-based access control

### Artwork Management

- View artworks
- Manage artwork listings
- Remove inappropriate or unwanted artwork

### Category Management

- Create categories
- Update categories
- Delete categories
- Manage artwork classification

### Order Management

- View all orders
- View order details
- Update order status
- Manage order lifecycle

### Support Management

- View customer support tickets
- View ticket conversations
- Reply to customers
- Update ticket status

### Announcements

- Create announcements
- Send announcements to users
- Email-based announcements

---

# 🔐 Security

The application implements multiple authentication and authorization mechanisms.

## JWT Authentication

JSON Web Tokens are used for authenticated API requests.

The backend:

- Validates JWT tokens
- Loads the associated user
- Checks account status
- Assigns Spring Security authorities
- Protects authenticated endpoints

## Role-Based Authorization

The application supports:

```text
ROLE_ADMIN
ROLE_ARTIST
ROLE_CUSTOMER
````

Backend endpoints are protected using Spring Security and method-level authorization.

Example:

```java
@PreAuthorize("hasRole('ADMIN')")
```

## Password Security

Passwords are securely hashed using:

```text
BCrypt
```

## Google OAuth 2.0

Users can authenticate using their Google account through Spring Security OAuth 2.0.

## Email Verification

New accounts must verify their email address before completing the normal login flow.

## OTP Security

OTP-based verification is used for:

* Password reset
* Account reactivation

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │      Vite + React   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Repositories        │
                    │ Security            │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────┘     └──────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │     MySQL       │        │   Gmail SMTP    │
        │    Database     │        │ Email Services  │
        └─────────────────┘        └─────────────────┘

                            │
                            ▼
                   ┌─────────────────┐
                   │  Google OAuth   │
                   │  Authentication │
                   └─────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React        | User interface          |
| Vite         | Frontend build tool     |
| React Router | Client-side routing     |
| Axios        | REST API communication  |
| STOMP.js     | WebSocket communication |
| Recharts     | Data visualization      |
| Lucide React | Icons                   |
| Sonner       | Toast notifications     |
| Tailwind CSS | Utility-based styling   |

---

## Backend

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| Java              | Backend programming language   |
| Spring Boot       | Backend framework              |
| Spring Security   | Authentication & authorization |
| Spring Data JPA   | Database access                |
| Hibernate         | ORM                            |
| JWT               | Token-based authentication     |
| OAuth 2.0         | Google authentication          |
| JavaMail          | Email functionality            |
| STOMP / WebSocket | Real-time notifications        |
| Maven             | Dependency management          |

---

## Database

```text
MySQL
```

The application uses:

* JPA entities
* Hibernate ORM
* Repository pattern
* Relational database relationships
* Foreign-key relationships

---

# 📁 Project Structure

```text
ArtGallerySpringBootAndReact/
│
├── artgallery/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/artgallery/
│   │   │   │       ├── config/
│   │   │   │       ├── controller/
│   │   │   │       ├── dto/
│   │   │   │       ├── entity/
│   │   │   │       ├── enums/
│   │   │   │       ├── repository/
│   │   │   │       ├── security/
│   │   │   │       └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── email/
│   │   │       ├── static/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── artgallery-frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔑 User Roles

| Role     | Access                                           |
| -------- | ------------------------------------------------ |
| Customer | Browse, wishlist, cart, orders, reviews, support |
| Artist   | Upload and manage artwork, view related orders   |
| Admin    | Full management access                           |

---

# 🔄 Application Flow

## Customer Registration

```text
Register
   │
   ▼
Create User
   │
   ▼
Generate Verification Token
   │
   ▼
Send Verification Email
   │
   ▼
User Verifies Email
   │
   ▼
Account Activated
   │
   ▼
Login
```

---

## Login

```text
User Login
    │
    ▼
Validate Credentials
    │
    ├── Invalid ──────► Reject
    │
    ▼
Check Account Status
    │
    ├── Disabled ─────► Reactivation OTP
    │
    ▼
Check Email Verification
    │
    ├── Not Verified ─► Verification Required
    │
    ▼
Generate JWT
    │
    ▼
Authenticated Session
```

---

# 📧 Email System

The application integrates with Gmail SMTP for transactional emails.

Emails are used for:

* Email verification
* Password reset OTP
* Account reactivation OTP
* Order confirmation
* Order status updates
* Announcements

Email messages use a common Aurelian Gallery HTML template with:

* Responsive layout
* Aurelian Gallery branding
* Embedded logo
* HTML formatting
* Security-related messaging

---

# 🔔 Real-Time Notifications

The application uses WebSocket/STOMP communication for real-time notifications.

Notifications can be generated for events such as:

* New orders
* Order status changes
* Account events
* Other important user activities

The frontend maintains the notification state and displays unread notifications through the notification interface.

---

# 💬 Customer Support

The support system is ticket-based.

Customers can:

```text
Create Ticket
     │
     ▼
Select Category
     │
     ▼
Add Message
     │
     ▼
Support Team Responds
     │
     ▼
Conversation Continues
     │
     ▼
Ticket Resolved
```

Each ticket can contain multiple messages between the customer and administrator.

---

# 🤖 FAQ Assistant

The customer support page includes a frontend-based FAQ assistant.

It provides answers to frequently asked questions related to:

* Orders
* Payments
* Artworks
* Accounts
* Technical issues

The FAQ assistant uses client-side matching to identify relevant questions.

If no suitable answer is found, the customer can create a support request directly.

---

# 🛒 Order Management

The order lifecycle supports multiple statuses:

```text
PLACED
   │
   ▼
PACKED
   │
   ▼
SHIPPED
   │
   ▼
DELIVERED
```

Orders may also be:

```text
CANCELLED
```

Customers receive notifications and email updates when order status changes.

---

# ⭐ Artwork Reviews

Customers can review artworks.

The review system supports:

* One review per customer per artwork
* Creating reviews
* Editing personal reviews
* Deleting personal reviews
* Displaying review summaries
* Displaying customer reviews

---

# ⚙️ Installation

## Prerequisites

Install the following before running the project:

* Java 17+
* Maven
* Node.js
* npm
* MySQL
* Git

---

# 🗄️ Database Setup

Create the MySQL database:

```sql
CREATE DATABASE artgallery;
```

Update the backend configuration with your MySQL credentials.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/artgallery?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

# 🔐 Environment Configuration

**Do not commit real credentials to GitHub.**

The following values must be configured locally:

```properties
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

jwt.secret=YOUR_JWT_SECRET

spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

For Gmail SMTP, use a **Google App Password** rather than your normal Gmail password.

---

# ▶️ Running the Backend

Navigate to the backend directory:

```bash
cd artgallery
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start at:

```text
http://localhost:8080
```

---

# ▶️ Running the Frontend

Open another terminal:

```bash
cd artgallery-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🌐 API

The React frontend communicates with the Spring Boot backend through REST APIs.

Example API structure:

```text
/api/auth/**
/api/artworks/**
/api/orders/**
/api/cart/**
/api/wishlist/**
/api/reviews/**
/api/support/**
/api/admin/**
```

Authenticated APIs use JWT-based authorization.

---

# 🔒 Security Notes

Before deploying this project to production:

* Replace development secrets
* Never commit passwords
* Never commit Gmail App Passwords
* Never commit Google OAuth client secrets
* Use environment variables or a secure secrets manager
* Use HTTPS
* Configure production CORS
* Use a strong JWT secret
* Use a production database configuration
* Disable unnecessary debug logging

---

# 🧪 Development

The project can be developed locally using:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:8080
MySQL    → localhost:3306
```

---

# 📸 Screenshots

Screenshots can be added here to showcase the application.

Recommended screenshots:

```text
docs/
├── home.png
├── login.png
├── artwork-details.png
├── cart.png
├── orders.png
├── artist-dashboard.png
├── admin-dashboard.png
└── support.png
```

Then reference them using:

```markdown
![Home Page](docs/home.png)
```

---

# 🧩 Key Backend Concepts

The backend follows a layered architecture:

```text
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

The project uses:

* RESTful APIs
* DTOs
* Service layer
* Repository pattern
* JPA/Hibernate
* Spring Security
* JWT authentication
* OAuth 2.0
* Role-based authorization
* WebSockets
* Transaction management
* Email services

---

# 🎯 Learning Objectives

This project demonstrates practical implementation of:

* Full-stack application development
* REST API development
* Spring Boot
* React
* Database design
* Authentication and authorization
* JWT
* OAuth 2.0
* CRUD operations
* File uploads
* E-commerce workflows
* WebSocket communication
* Email integration
* Role-based access control
* Frontend routing
* API integration
* Customer support systems

---

# 🔮 Future Improvements

Possible future improvements include:

* Payment gateway integration
* Cloud image storage
* Production deployment
* Docker support
* Automated testing
* CI/CD pipeline
* Advanced artwork search
* Recommendation system
* Analytics dashboard
* Artist verification
* Advanced reporting
* Cloud-based email service
* Redis caching

---

# 👨‍💻 Author

## Uday Reddy Kallam

Computer Science Graduate | Full-Stack Developer

### Technologies

```text
Java
Spring Boot
React
MySQL
JavaScript
Python
AWS
REST APIs
JWT
OAuth 2.0
```

### GitHub

[https://github.com/udaykallam](https://github.com/udaykallam)

### Repository

[https://github.com/udaykallam/ArtGallerySpringBootAndReact](https://github.com/udaykallam/ArtGallerySpringBootAndReact)

---

# 📜 License

This project is intended for educational and portfolio purposes.

---

<div align="center">

## 🎨 Aurelian Gallery

### Art. Elegance. Inspiration.

</div>
```
