# Gardenly

Gardenly is a full-stack MERN e-commerce platform built for gardening products and services. It supports role-based workflows for buyers and sellers, secure authentication, OTP-based account actions, image uploads, cart and order management, and cloud-based deployment.

## Project Overview

Gardenly is designed as a practical multi-role commerce application where users can browse products, create accounts, manage carts, place orders, and verify sensitive actions through OTP-based email flows. Sellers can manage listings, while buyers can complete purchases securely through the same platform.

The project focuses on clean full-stack integration across frontend, backend, database, authentication, media storage, email delivery, CI/CD, and deployment.

## Highlights

- Full-stack MERN e-commerce platform
- JWT + Google OAuth authentication
- OTP verification using Brevo Email API
- Role-based Buyer/Seller workflows
- CI/CD with GitHub Actions
- Docker build verification
- Production deployment using Vercel + Render

## Live Deployment

- Frontend: https://gardenly-flame.vercel.app
- Backend: https://gardenly-backend.onrender.com

## Features

- JWT-based authentication
- Google OAuth login
- Role-based access system
- Buyer and seller workflows
- Signup OTP email verification
- Forgot password OTP flow
- Order OTP verification flow
- Product management
- Cart management
- Order placement and tracking
- Cloudinary image upload integration
- Secure cookie-based auth handling
- MongoDB Atlas database integration
- Production deployment on Vercel and Render

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB Atlas

### Authentication
- JWT
- Google OAuth
- Email OTP verification

### Media & Email Services
- Cloudinary
- Brevo Email API

### Deployment
- Vercel
- Render

### CI/CD
- GitHub Actions
- Frontend checks
- Backend checks
- Docker build verification

### Containerization
- Docker
- Docker Compose

## Architecture

Gardenly follows a frontend-backend-service architecture:

- The React frontend on Vercel handles the UI, routing, forms, and user interactions.
- The Express backend on Render exposes APIs for authentication, products, carts, orders, and OTP workflows.
- MongoDB Atlas stores users, products, carts, and order data.
- Cloudinary handles image storage for uploaded assets.
- Brevo Email API is used for OTP delivery over HTTPS.

High-level flow:

Frontend -> Backend API -> MongoDB Atlas / Cloudinary / Brevo

## CI/CD

This project uses GitHub Actions for validation before deployment.

Current pipeline:
- `frontend-checks`
  - install frontend dependencies
  - run lint
  - run tests
  - run production build validation
- `backend-checks`
  - install backend/root dependencies
  - run backend tests
- `docker-build-verification`
  - build backend Docker image
  - build frontend Docker image

Deployment flow:
- Push code to GitHub
- GitHub Actions runs validation checks
- Vercel automatically deploys the frontend
- Render automatically deploys the backend

This setup helps catch frontend, backend, and Docker build issues early while keeping production deployment simple.

## Docker

Docker is included for containerization and build verification.

This project is **not** deployed to production using Docker containers. Production deployment currently uses:
- Vercel for the frontend
- Render for the backend

Docker is used here for:
- local container-based setup
- image build verification in CI
- demonstrating portability of the application

## Project Structure

```text
Gardenly/
├── api/                  # Backend source code
├── client/               # Frontend source code
├── .github/workflows/    # GitHub Actions CI
├── Dockerfile.backend
├── Dockerfile.client
├── docker-compose.yml
├── package.json          # Root/backend package config
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 20+
- npm
- MongoDB Atlas connection string or local MongoDB
- Cloudinary account
- Google OAuth credentials
- Brevo API credentials

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Gardenly
```

### 2. Install backend/root dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Create environment variables
Create a `.env` file in the project root and use placeholder values based on the example below.

### 5. Run the backend
```bash
npm run dev
```

### 6. Run the frontend
Open a second terminal:
```bash
cd client
npm run dev
```

### 7. Open locally
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Environment Variables

Use placeholders only. Do not commit real secrets.

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_oauth_client_id
JWT_SECRET=your_jwt_secret

BREVO_API_KEY=your_brevo_api_key
MAIL_FROM_EMAIL=your_verified_brevo_email
MAIL_FROM_NAME=Gardenly

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

CLIENT_ORIGIN=http://localhost:5173
```

## Available Scripts

### Root / Backend
```bash
npm run dev
npm start
npm test
npm run test:coverage
```

### Frontend
```bash
cd client
npm run dev
npm run build
npm run test
npm run test:coverage
npm run lint
```

## Screenshots

> Add screenshots here for better project presentation.

Suggested screenshots:
- Homepage
- Login / Signup
- Product page
- Cart page
- Order flow
- Seller dashboard

## Future Improvements

- Add seller analytics dashboard
- Add payment gateway integration for online checkout
- Add stronger test coverage for auth and order edge cases
- Add API rate limiting and request monitoring
- Add product reviews and ratings workflow
- Add admin reporting and moderation tools
- Add screenshot gallery and short demo video
- Add infrastructure configuration for easier environment setup

## Why This Project Matters

Gardenly demonstrates practical full-stack engineering across:
- authentication
- REST API development
- database integration
- OTP/email workflows
- image upload handling
- CI/CD automation
- cloud deployment
- Docker-based build verification


