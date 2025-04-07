# Cibaria

Cibaria is a full-stack web application designed to help users discover, save, and manage recipes effortlessly. The project consists of a **frontend** built with Angular and a **backend** powered by Spring Boot, providing a seamless experience for culinary enthusiasts.

---

## Features

- **Recipe Management**: Add, view, update, and delete recipes.
- **User Authentication**: Secure login and role-based access.
- **Dynamic Filtering**: Search recipes by difficulty, category, servings, and preparation time.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **RESTful API**: Backend services for managing recipes, users, and ratings.

---

## Project Structure

### Frontend
- **Framework**: Angular 18.2.7
- **Location**: `frontend/`
- **Key Features**:
  - Dynamic recipe pages.
  - User-friendly forms for adding and editing recipes.
  - Integration with backend APIs for data fetching and submission.

### Backend
- **Framework**: Spring Boot 3.4.1
- **Location**: `backend/`
- **Key Features**:
  - RESTful API endpoints for recipes, users, and ratings.
  - PostgreSQL database integration.
  - Secure authentication and authorization using Spring Security.

---

## Prerequisites

- **Frontend**:
  - Node.js (v18 or higher)
  - Angular CLI

- **Backend**:
  - Java 17 or higher
  - Maven
  - PostgreSQL database

---

## Setup Instructions

### Backend
1. Navigate to the `backend/` directory.
2. Configure the database connection in `src/main/resources/application.properties`.
3. Run the following commands:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend

1. Navigate to the frontend/ directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open the application in your browser at http://localhost:4200

## API Endpoints

### Recipes
  - `GET /api/recipes`: Fetch all recipes with optional filters.
  - `GET /api/recipes/{id}`: Fetch a recipe by ID.
  - `POST /api/recipes`: Add a new recipe.
  - `PUT /api/recipes/{id}`: Update an exisiting recipe.
  - `DELETE /api/recipes/{id}`: Delete a recipe.

### Users
 - `POST /api/auth/login`: User login.
 - `POST /api/auth/register`: User registration.

## Development Notes
- Frontend:
  - Use `ng generate` to scaffold new components, services, or modules.
  - Run `ng test` to execute unit tests.
- Backend:
  - Use `mvn test` to run unit tests.
  - Ensure the database is running before starting the backend.

 ## Future Enhancemenets
   - Add support for image uploads in recipe
   - Implement responsive web design
   - Enhance user profile management
   - Implement option to add recipes to favourites
