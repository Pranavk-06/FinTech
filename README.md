# India's Financial Digital Twin for Life

## Project Structure

- **frontend/**: Next.js application (React, Tailwind CSS, Framer Motion)
- **backend/api/**: Node.js + Express + MongoDB (Auth, User Data)
- **backend/ml/**: Python + FastAPI (Financial Models, Simulations)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Running locally or Atlas URI)

### Setup

1.  **Backend API (Node.js)**
    ```bash
    cd backend/api
    npm install
    # Create .env file with MONGODB_URI and JWT_SECRET
    npm run dev
    ```

2.  **ML Service (Python)**
    ```bash
    cd backend/ml
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    source venv/bin/activate # Mac/Linux
    pip install -r requirements.txt
    python main.py
    ```

3.  **Frontend (Next.js)**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Features
- **Landing Page**: Animated storytelling ("No Where" vs "Now Here").
- **Authentication**: Secure login with JWT.
- **Digital Twin**: Personalization based on role, location, and spending.
- **Simulations**: Cost of living, goal completion, and investment advice.
