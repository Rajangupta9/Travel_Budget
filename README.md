# Travel Budget

A comprehensive travel budget management application that helps travelers plan, track, and optimize their trip expenses.

## Home page
![image](https://github.com/user-attachments/assets/df82b8aa-66e5-485a-b33a-579df331d2c2)

## login
![image](https://github.com/user-attachments/assets/bd414746-278e-4e89-a7c0-96ac41583544)

## Signup
![image](https://github.com/user-attachments/assets/1f1d0fea-e56d-4b3b-af9f-4f8c2ba91263)

## Dashboard
![image](https://github.com/user-attachments/assets/dddc49e5-219c-4a84-803e-04ec13b50479)

## Expenses
![image](https://github.com/user-attachments/assets/17f3c5be-bc89-4b26-8602-d39e01a7a694)

## Trip-planner
![image](https://github.com/user-attachments/assets/9f4a941c-a29e-410d-a93d-edf2eb224c96)

## Destination
![image](https://github.com/user-attachments/assets/7b0852ef-c8cf-47d9-ad9c-35c05e495cf8)

## Reports
![image](https://github.com/user-attachments/assets/786d0943-6d74-4e49-bd17-f23cc12a3169)










## Overview

Travel Budget is a full-stack application built with React and Node.js that simplifies financial planning for trips and vacations. The app allows users to create detailed budget plans for their travels, track real-time expenses during the trip, and analyze spending patterns to make informed decisions.

## Tech Stack

### Frontend
- React 19
- React Router v7
- Axios for API requests
- Recharts for data visualization
- Tailwind CSS v4 for styling
- Framer Motion for animations
- Lucide React for icons
- Vite as the build tool

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications
- Node-cron for scheduled tasks

## Features

- **User Authentication**: Secure signup, login, and password reset with OTP verification
- **Trip Management**: Create, read, update, and delete trip plans
- **Expense Tracking**: Record and categorize expenses with support for different currencies
- **Budget Monitoring**: Set budget limits and receive alerts when approaching thresholds
- **Expense Analytics**: Visualize spending patterns with interactive charts
- **Report Generation**: Create and export detailed financial reports
- **Real-time Updates**: Get instant updates on budget changes via WebSockets

## Project Structure

```
travel-budget/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   └── src/
│       ├── assets/     # Images, fonts, etc.
│       ├── components/ # Reusable UI components
│       ├── pages/      # Page components
│       ├── services/   # API service integration
│       ├── context/    # React context providers
│       └── utils/      # Utility functions
│
├── backend/            # Node.js backend application
│   ├── controllers/    # Request handlers
│   ├── models/         # Mongoose data models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas account
- Git

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Rajangupta9/Travel_Budget.git
cd Travel_Budget/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_budget
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
```

5. Access the application at http://localhost:5173

## API Endpoints

### Authentication
- `POST /user/signup` - Register new user
- `POST /user/login` - User login
- `POST /user/forgot-password` - Request password reset (sends OTP)
- `POST /user/verify-otp` - Verify OTP code
- `POST /user/reset-password` - Reset password with token
- `GET /user/profile` - Get user profile

### Trip Management
- `POST /trip/create-trip` - Create new trip
- `GET /trip/trips` - Get all user trips
- `GET /trip/:id` - Get trip by ID
- `PUT /trip/update-trip/:id` - Update trip
- `DELETE /trip/delete-trip/:id` - Delete trip

### Expense Management
- `POST /expense/create` - Create new expense
- `GET /expense` - Get all expenses (with optional query parameters)
- `GET /expense/:id` - Get expense by ID
- `PUT /expense/:id` - Update expense
- `DELETE /expense/:id` - Delete expense
- `GET /expense/statistics/:tripId` - Get expense statistics for a trip

### Report Management
- `POST /report/create` - Create new report
- `GET /report` - Get user reports
- `GET /report/:id` - Get report by ID
- `DELETE /report/:id` - Delete report
- `GET /report/all` - Get all reports (admin only)
- `GET /report/compare` - Compare multiple reports

## Usage

### Authentication Flow

1. User signs up with email and password
2. User logs in to receive JWT token
3. Token is stored in localStorage and automatically used for authenticated requests

### Trip Planning Flow

1. User creates a new trip with destination, dates, and budget
2. Trip details can be updated or deleted as needed
3. User adds expenses to the trip with categories and amounts
4. Reports can be generated to analyze spending patterns

### Password Reset Flow

1. User requests password reset with email
2. System sends OTP to user's email
3. User verifies OTP and sets new password

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Rajan Gupta - rajang797@gmail.com

Project Link: [https://github.com/Rajangupta9/Travel_Budget](https://github.com/Rajangupta9/Travel_Budget)
