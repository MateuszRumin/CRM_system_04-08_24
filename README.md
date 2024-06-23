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


