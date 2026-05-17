# ExpenseTracker Microservices Platform

A full-stack microservices-based Expense Tracking platform built using:

* Spring Boot Microservices
* Next.js Frontend
* Apache Kafka
* Kong API Gateway
* MySQL
* Docker & Docker Compose
* AI/DS Service using Flask

This project provides secure authentication, user management, expense tracking, and AI-powered analytics.

---

# Architecture

## Microservices

| Service         | Description                           |
| --------------- | ------------------------------------- |
| auth-service    | Authentication & JWT token management |
| user-service    | User profile management               |
| expense-service | Expense CRUD operations               |
| ds-service      | AI/Data Science analytics service     |
| kong-service    | API Gateway                           |
| kafka           | Event streaming between services      |
| mysql           | Database storage                      |
| zookeeper       | Kafka dependency                      |
| frontend        | Next.js frontend UI                   |

---

# Tech Stack

## Backend

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* Kafka
* MySQL
* Gradle / Maven

## Frontend

* Next.js 16
* React
* Tailwind CSS
* TypeScript
* shadcn/ui

## DevOps

* Docker
* Docker Compose
* Kong API Gateway

## AI / Analytics

* Flask
* Python

---

# Features

## Authentication

* User Signup
* User Login
* JWT Authentication
* Refresh Tokens
* Secure API Access

## Expense Management

* Add Expenses
* Track Expenses
* View Expense History
* User-based Expense Separation

## AI Analytics

* AI-powered expense insights
* Data processing service
* Analytics microservice support

## API Gateway

* Kong API Gateway integration
* Centralized routing
* Authentication filtering

---

# Project Structure

```bash
expensetracker/
│
├── authservice/
├── userservice/
├── expenseservice/
├── ds-service/
├── expensetracker-web/
├── expenseTrackerAppDeps/
│   └── services.yml
│
└── README.md
```

---

# Docker Setup

## Start All Services

```bash
cd expenseTrackerAppDeps

docker compose -f services.yml up --build
```

## Run in Detached Mode

```bash
docker compose -f services.yml up -d
```

## Stop Services

```bash
docker compose -f services.yml down
```

---

# Frontend Setup

```bash
cd expensetracker-web

npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Backend Setup

## Auth Service

```bash
cd authservice
./gradlew bootRun
```

## User Service

```bash
cd userservice
./gradlew bootRun
```

## Expense Service

```bash
cd expenseservice
./gradlew bootRun
```

---

# API Gateway

Kong routes requests through:

```bash
http://localhost:8000
```

Example:

```bash
POST /auth/v1/login
GET /user/v1/getUser
```

---

# Authentication Flow

1. User signs up
2. auth-service generates JWT token
3. user-service stores user profile
4. Frontend stores token locally
5. Kong routes authenticated requests

---

# Kafka Communication

Kafka is used for inter-service communication.

Examples:

* auth-service → user-service
* event-driven user updates
* async service communication

---

# Database

MySQL 8.3.0 is used as the primary database.

Databases:

* authservice
* userservice
* expenseservice

---

# Environment Variables

Example configuration:

```env
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
KAFKA_HOST=kafka
KAFKA_PORT=9092
```

---

# Common Commands

## Rebuild Specific Service

```bash
docker compose -f services.yml build --no-cache user-service
```

## View Logs

```bash
docker logs -f expensetrackerappdeps-user-service-1
```

## Remove Containers

```bash
docker compose -f services.yml down
```

---

# Current Improvements

* Improved CORS handling
* Fixed frontend authentication flow
* Added JWT-based authorization
* Improved Docker networking
* Better user profile handling

---

# Future Enhancements

* Expense categorization using AI
* Charts & analytics dashboard
* Budget prediction
* Cloud deployment
* Notification system
* Mobile app support

---

# Screenshots

Add screenshots here:

```bash
/assets/screenshots
```

---

# Author

PARIJAT DUTTA

IT Student | Machine Learning & Full Stack Development

---

# License

This project is for educational and learning purposes.
