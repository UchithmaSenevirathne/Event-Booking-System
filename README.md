# Event Booking System

## Setup and Run Instructions

### Frontend Setup
1. Clone the repository:  
   `git clone https://github.com/UchithmaSenevirathne/Event-Booking-System.git`

2. Navigate to the frontend directory:  
   `cd frontend`

3. Install dependencies:  
   `npm install`

4. Start the development server:  
   `npm start`

5. The frontend should now be accessible at `http://localhost:3000`.

### Backend Setup
1. Clone the repository:  
   `git clone https://github.com/UchithmaSenevirathne/Event-Booking-System.git`

2. Navigate to the backend directory:  
   `cd backend`

3. Create the database using PostgreSQL:
   - Set up a PostgreSQL database with the following schema:  
     `CREATE DATABASE event_booking_system;`

4. Configure application properties:
   - Update `application.properties` with your PostgreSQL credentials.

5. Build and run the backend:
   - If using Maven:  
     `mvn spring-boot:run`
   - If using Gradle:  
     `./gradlew bootRun`

6. The backend should now be accessible at `http://localhost:8080`.

---

## Project Structure Overview

### Frontend
- `/src`: Contains all the frontend React components, pages, and utilities.
  - `/components`: Reusable UI components (e.g., buttons, form fields).
  - `/pages`: React components for different pages (Login, Signup, Event List, Booking).
  - `/assets`: Images for website

### Backend
- `/src/main/java/lk/ijse/backend`: Contains all backend services.
  - `/controller`: REST API controllers (Auth, Events, Bookings).
  - `/service`: Business logic (Event management, Booking handling).
  - `/repository`: Repository interfaces for database operations.
  - `/Enities`: Entity classes (User, Event, Booking).
  - `/Dtos`: DTO classes (UserDTO, EventDTO, BookingDTO).
  - `/config`: Configuration for Spring Security and JWT-based authentication.

---

## Auth Flow Explanation
1. **Login**: Users can log in by sending a POST request to `events/backend/user/authenticate` with their email and password. A JWT token is returned upon successful authentication.
2. **Signup**: New users can register by sending a POST request to `events/backend/user/register` with their email and password. Email format is validated, and duplicate emails are prevented.
3. **JWT Token**: After logging in, the JWT token must be included in the Authorization header (`Bearer <token>`) for all protected routes (e.g., `/bookings`).
4. **Role-based Access**: Users with the "user" role can access `/bookings` and view their history, while "admin" users can manage events (create, edit, delete).

---

## Design Decisions
1. **Frontend Framework**: React was chosen for the frontend to build a dynamic, component-based UI with TypeScript for type safety.
2. **UI Libraries**: Tailwind CSS for utility-first design and Ant Design for UI components were used to build a responsive, user-friendly interface.
3. **Backend Framework**: Spring Boot was used for the backend to provide a robust, scalable REST API with built-in security features.
4. **Authentication**: JWT was chosen for stateless authentication, ensuring scalability and security across API requests.
5. **Database**: PostgreSQL was chosen as the relational database to store user, event, and booking data due to its stability and scalability.

---

## Assumptions Made
1. **Role-based Access Control**: The system assumes users will either have a "user" or "admin" role. Admins have the ability to manage events.
2. **Availability of Tickets**: The system assumes that the event will not automatically update the available tickets count in real-time once a booking is made unless the backend refreshes the data.
3. **Database Configuration**: PostgreSQL is assumed to be configured and running on the local machine or cloud service.

---

## Clarify Public vs Protected Routes
1. **Public Routes**:
   - `/`: Viewable by everyone, no authentication required.
   - 
2. **Protected Routes**:
   - `layout/bookings`: Requires authentication (JWT token in Authorization header).
   - `layout/events`: Requires authentication.

---

## External Tools or Assistance
- **ChatGPT**: Used for assisting in API design, algorithmic approaches, and troubleshooting specific coding issues related to React and Spring Boot.

