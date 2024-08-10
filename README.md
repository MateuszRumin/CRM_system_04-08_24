# CRM_system_04-06_24

# Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- MySQL2

# Installation

- clone the repository
- cd crm-system
- cd server
- npm install
- cd client
- npm install

# Running the Application

## Backend

- cd server
- npm start

## Frontend

- cd client
- npm run dev

## Database

in .env file set connection witch this schema:
DATABASE_URL="mysql://User_name:password@host:port/database_name"
SHADOW_DATABASE_URL="mysql://User_name:password@host:port/database2_name"

to run mirations:
-npm run migrate

## 1.Client .env file example

# Serwer API URL
VITE_API_SERVER_URL=http://localhost:3000


## 2.Server .env file example

# Connetion to database
PORT=3000
DATABASE_URL="mysql://roottest:passwordtest@localhost:3306/admin_test"
SHADOW_DATABASE_URL="mysql://roottest:passwordtest@localhost:3306/admin_test"
REACT_APP_API_BASE_URL=http://localhost:3000


# mail connection data (nodemailer)
EMAIL_HOST=test
EMAIL_PORT=test
EMAIL_SECURE=true
EMAIL_USER=test
EMAIL_PASS=test



