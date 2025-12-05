# BookFlix

## 📝 Description

BookFlix is a web-based book browsing and review platform that provides users with a Netflix-style interface for discovery, viewing, and reviewing books. Built as a comprehensive digital library, the system allows users to explore various genres, read and submit reviews with star ratings, manage their personal saved book collections, and discover new authors and reading material.

## 🚀 Core Functions and Features

The platform provides a rich set of features focusing on discovery, personalization, and community feedback:

**Book Discovery & Browsing**: Browse books organized by genres in horizontal scrollable rows, utilize a powerful search function across books and authors, and view a featured book hero banner on the dashboard.

**User Authentication & Personalization**: Secure sign-in/sign-up, personalized dashboards, protected routes, and user session management.

**Review System**: Users can write and submit detailed reviews with 1-5 star ratings, view average community ratings, and see their own reviews visually distinguished.

**Book Management**: Easily save and unsave books to a personal collection, browse books filtered by author or genre, and receive similar book recommendations on the details page.

**Author Profiles**: Comprehensive author pages featuring biographies, all associated books, and aggregated author ratings/statistics.

## 💻 Technologies Used

This is a full-stack application built using a modern React frontend and a C#/.NET Core backend.

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)

### Backend
![.NET](https://img.shields.io/badge/.NET_Core-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-12.0-239120?style=for-the-badge&logo=csharp&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

### Key Features by Technology

| Technology | Purpose |
|-----------|---------|
| **React** | Core UI library for component-based development |
| **TypeScript** | Adds static typing for type safety and better IDE support |
| **Tailwind CSS** | Utility-first framework for rapid, responsive UI development |
| **Vite** | Modern build tool providing hot module replacement (HMR) |
| **React Router DOM** | Handles client-side navigation and protected routes |
| **ASP.NET Core** | Cross-platform framework for building the RESTful API and business logic (MVC pattern) |
| **C#** | Used for implementing controllers, models, and data access |
| **SQL Server** | Primary database for all book, user, and review data |
| **Microsoft.Data.SqlClient** | ADO.NET provider for connecting the backend to SQL Server |

## 📁 Project Structure

```
560-Project/
├── README.md                 # This file
├── tables.sql               # CREATE TABLE statements with all constraints
├── procedures.sql           # All stored procedures supporting application functionality
├── aggregation.sql          # Four aggregating queries for statistical insights
├── Data/                    # Initial data population scripts
├── backend/                 # ASP.NET Core Web API application
└── frontend/                # React + TypeScript web application
```

### File Descriptions

- **tables.sql**: Contains all CREATE TABLE statements with primary keys, foreign keys, unique constraints, and check constraints
- **procedures.sql**: All stored procedures with CREATE PROCEDURE statements, parameters, and comments explaining each procedure's purpose
- **aggregation.sql**: Four aggregating queries demonstrating GROUP BY, aggregate functions (AVG, COUNT, SUM), and JOINs
- **Data/**: Folder containing SQL and Python scripts to populate initial data (authors, books, genres, and their relationships)
- **backend/**: Complete ASP.NET Core application using ADO.NET (Microsoft.Data.SqlClient) - **No ORM frameworks used**
- **frontend/**: Complete React application with TypeScript, Tailwind CSS, and React Router

## ⚙️ Setup Instructions

### Database Setup
1. Execute `tables.sql` to create all tables
2. Execute scripts in `Data/` folder to populate initial data
3. Execute `procedures.sql` to create stored procedures
4. Update connection string in `backend/appsettings.json`

### Backend Setup
```bash
cd backend
dotnet restore
dotnet run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📝 Important Notes

- **No ORM Used**: This application exclusively uses ADO.NET with SqlConnection, SqlCommand, and SqlDataReader for all database operations, as required by course guidelines
- All database interactions are through raw SQL and stored procedures
- Tables match the Database Design provided in the accompanying Project Report