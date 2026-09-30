# 🎨 Aurelian Gallery

<p align="center">
  <strong>Art Gallery Management & E-Commerce Platform</strong>
</p>

<p align="center">
  A full-stack art gallery platform built with <strong>Spring Boot</strong>, <strong>React</strong>, and <strong>MySQL</strong>.
</p>

<p align="center">
  <a href="https://github.com/udaykallam/ArtGallerySpringBootAndReact">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
  <img src="https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

---

## ✨ Overview

**Aurelian Gallery** is a role-based Art Gallery Management and E-Commerce platform designed for **customers, artists, and administrators**.

The platform combines artwork discovery, shopping, order management, artist tools, administration, authentication, customer support, email communication, and real-time notifications into a single full-stack application.

### 👥 Platform Roles

| Role | Main Capabilities |
|---|---|
| 👤 **Customer** | Browse artworks, wishlist, cart, orders, reviews, notifications, support |
| 🎨 **Artist** | Upload and manage artwork, view related orders |
| 🛡️ **Admin** | Manage users, artworks, categories, orders, support, announcements |

---

# 🚀 Features

## 👤 Customer

### 🔐 Authentication & Account

- User registration
- Email verification
- JWT authentication
- Google OAuth 2.0 login
- Forgot password
- OTP-based password reset
- Change password
- Account deactivation
- OTP-based account reactivation
- Protected routes
- Role-based authorization

### 🖼️ Artwork

- Browse artworks
- Artwork search and filtering
- View artwork details
- View artwork categories
- View artist information
- Submit artwork reviews
- Edit personal reviews
- Delete personal reviews
- One review per customer per artwork

### 🛒 Shopping

- Add artworks to cart
- Remove artworks from cart
- Manage wishlist
- Place orders
- View order history
- Track order status

### 🔔 Notifications

- Real-time notifications
- Order notifications
- Account-related notifications
- Read/unread notification state

### 💬 Customer Support

- Create support tickets
- Select support categories
- Associate tickets with orders
- View support conversations
- Send messages to support
- Track ticket status
- Frontend FAQ assistant

---

## 🎨 Artist

### 🖼️ Artwork Management

- Upload artwork
- Add artwork information
- Upload artwork images
- Edit artwork
- Manage artwork listings
- View artwork-related information

### 📦 Order Management

- View orders related to artist artwork
- Track order status

---

## 🛡️ Admin

### 👥 User Management

- View users
- Manage customer accounts
- Manage artist accounts
- Enable/disable accounts
- Role-based access control

### 🖼️ Artwork Management

- View artworks
- Manage artwork listings
- Remove unwanted artwork

### 🏷️ Category Management

- Create categories
- Update categories
- Delete categories
- Manage artwork classification

### 📦 Order Management

- View all orders
- View order details
- Update order status
- Manage the order lifecycle

### 💬 Support Management

- View customer support tickets
- View ticket conversations
- Reply to customers
- Update ticket status

### 📢 Announcements

- Create announcements
- Send announcements to users
- Send announcement emails

---

# 🔐 Security

Aurelian Gallery uses multiple authentication and authorization mechanisms.

## JWT Authentication

Authenticated API requests use JSON Web Tokens.

The backend:

- Validates JWT tokens
- Loads the associated user
- Checks account status
- Assigns Spring Security authorities
- Protects authenticated endpoints

## Role-Based Authorization

```text
ROLE_ADMIN
ROLE_ARTIST
ROLE_CUSTOMER
```

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

OTP verification is used for:

- Password reset
- Account reactivation

---

# 🏗️ System Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│          Vite + React         │
└───────────────┬───────────────┘
                │
                │ REST API / WebSocket
                ▼
┌───────────────────────────────┐
│        Spring Boot API        │
│                               │
│ Controllers                   │
│ Services                      │
│ Repositories                  │
│ Security                      │
└───────────┬───────────┬───────┘
            │           │
            ▼           ▼
┌────────────────┐  ┌────────────────┐
│     MySQL      │  │   Gmail SMTP   │
│    Database    │  │ Email Services │
└────────────────┘  └────────────────┘

                ┌────────────────┐
                │  Google OAuth  │
                │ Authentication │
                └────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| **React** | User interface |
| **Vite** | Frontend build tool |
| **React Router** | Client-side routing |
| **Axios** | REST API communication |
| **STOMP.js** | WebSocket communication |
| **Recharts** | Data visualization |
| **Lucide React** | Icons |
| **Sonner** | Toast notifications |
| **Tailwind CSS** | Utility-based styling |

## Backend

| Technology | Purpose |
|---|---|
| **Java** | Backend programming language |
| **Spring Boot** | Backend framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | Database access |
| **Hibernate** | ORM |
| **JWT** | Token-based authentication |
| **OAuth 2.0** | Google authentication |
| **JavaMail** | Email functionality |
| **STOMP / WebSocket** | Real-time notifications |
| **Maven** | Dependency management |

## Database

**MySQL**

The application uses:

- JPA entities
- Hibernate ORM
- Repository pattern
- Relational database relationships
- Foreign-key relationships

---

# 📁 Project Structure

```text
ArtGallerySpringBootAndReact/
│
├── artgallery/                         # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/artgallery/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── enums/
│   │   │   │   ├── repository/
│   │   │   │   ├── security/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   │       ├── email/
│   │   │       ├── static/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── artgallery-frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

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
Account Ready for Login
```

## Login

```text
User Login
    │
    ▼
Validate Credentials
    │
    ├── Invalid ───────► Reject
    │
    ▼
Check Account Status
    │
    ├── Disabled ──────► Reactivation OTP
    │
    ▼
Check Email Verification
    │
    ├── Not Verified ──► Verification Required
    │
    ▼
Generate JWT
    │
    ▼
Authenticated Session
```

---

# 📧 Email System

The application integrates with **Gmail SMTP** for transactional emails.

Emails are used for:

- Email verification
- Password reset OTP
- Account reactivation OTP
- Order confirmation
- Order status updates
- Announcements

Email messages use a common Aurelian Gallery HTML template featuring:

- Responsive layout
- Aurelian Gallery branding
- Embedded logo
- HTML formatting
- Security-related messaging

---

# 🔔 Real-Time Notifications

The application uses **WebSocket/STOMP** communication for real-time notifications.

Notifications can be generated for:

- New orders
- Order status changes
- Account events
- Other important user activities

---

# 💬 Customer Support

The support system is ticket-based.

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

The customer support page includes a **frontend-based FAQ assistant**.

It provides answers to frequently asked questions related to:

- Orders
- Payments
- Artworks
- Accounts
- Technical issues

If no suitable answer is found, the customer can create a support request directly.

---

# 🛒 Order Management

The order lifecycle supports:

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

- One review per customer per artwork
- Creating reviews
- Editing personal reviews
- Deleting personal reviews
- Displaying review summaries
- Displaying customer reviews

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

- **Java 17+**
- **Maven**
- **Node.js**
- **npm**
- **MySQL**
- **Git**

---

## 🗄️ Database Setup

Create the MySQL database:

```sql
CREATE DATABASE artgallery;
```

Update the backend configuration with your local MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/artgallery?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

# 🔐 Configuration & Secrets

> ⚠️ **Never commit real credentials or secrets to GitHub.**

Configure the following values locally:

```properties
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

jwt.secret=YOUR_JWT_SECRET

spring.mail.username=YOUR_GMAIL_ADDRESS
spring.mail.password=YOUR_GMAIL_APP_PASSWORD

spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
```

For Gmail SMTP, use a **Google App Password** instead of your normal Gmail password.

For production deployments, use environment variables or a dedicated secrets manager.

---

# ▶️ Running the Backend

```bash
cd artgallery
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

# ▶️ Running the Frontend

```bash
cd artgallery-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌐 API

The React frontend communicates with the Spring Boot backend through REST APIs.

### Main API Groups

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

# 🔒 Production Security Checklist

Before deploying the application to production:

- [ ] Replace all development secrets
- [ ] Never commit passwords
- [ ] Never commit Gmail App Passwords
- [ ] Never commit Google OAuth client secrets
- [ ] Use environment variables or a secure secrets manager
- [ ] Enable HTTPS
- [ ] Configure production CORS
- [ ] Use a strong JWT secret
- [ ] Use a production database configuration
- [ ] Disable unnecessary debug logging
- [ ] Configure production email credentials securely

---

# 🧩 Backend Architecture

The backend follows a layered architecture:

```text
┌───────────────┐
│  Controller   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    Service    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Repository   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    MySQL      │
└───────────────┘
```

### Key Backend Concepts

- RESTful APIs
- DTOs
- Service layer
- Repository pattern
- JPA/Hibernate
- Spring Security
- JWT authentication
- OAuth 2.0
- Role-based authorization
- WebSockets
- Transaction management
- Email services

---

# 📸 Screenshots

Add screenshots of the application to make the repository easier to explore.

Recommended structure:

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

Example:

```markdown
![Home Page](docs/home.png)
```

---

# 🎯 Learning Objectives

This project demonstrates practical implementation of:

- Full-stack application development
- REST API development
- Spring Boot
- React
- Database design
- Authentication and authorization
- JWT
- OAuth 2.0
- CRUD operations
- File uploads
- E-commerce workflows
- WebSocket communication
- Email integration
- Role-based access control
- Frontend routing
- API integration
- Customer support systems

---

# 🔮 Future Improvements

Potential future improvements include:

- 💳 Payment gateway integration
- ☁️ Cloud image storage
- 🚀 Production deployment
- 🐳 Docker support
- 🧪 Automated testing
- 🔄 CI/CD pipeline
- 🔎 Advanced artwork search
- 🤖 Artwork recommendation system
- 📊 Analytics dashboard
- 🎨 Artist verification
- 📈 Advanced reporting
- ☁️ Cloud-based email service
- ⚡ Redis caching

---

# 👨‍💻 Author

## Uday Reddy Kallam

**Computer Science Graduate · Full-Stack Developer**

### Tech Interests

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

### 🔗 Links

- **GitHub:** https://github.com/udaykallam
- **Repository:** https://github.com/udaykallam/ArtGallerySpringBootAndReact

---

# 📜 License

This project is intended for **educational and portfolio purposes**.

---

<p align="center">
  <strong>🎨 Aurelian Gallery</strong>
  <br>
  <em>Art. Elegance. Inspiration.</em>
</p>
