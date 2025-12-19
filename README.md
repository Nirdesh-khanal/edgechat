# BeatMe

BeatMe is a modern, full-stack application combining real-time chat functionality with music streaming capabilities. It features a sleek, responsive user interface built with React and a robust Django backend.

## 🚀 Features

- **Real-time Messaging**: Instant communication with other users.
- **Music Player**: Integrated music streaming experience.
- **User Authentication**: Secure login and registration.
- **File Sharing**: Send images and files seamlessly.
- **Modern UI**: Dark/Light mode support, glassmorphism design, and responsive layout using Tailwind CSS and DaisyUI.

## 🛠 Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: React Hooks
- **Routing**: React Router

### Backend
- **Framework**: Django
- **API**: Django REST Framework
- **Database**: SQLite (default) / PostgreSQL (configurable)

## 📦 Project Structure

```
c:\Chatbot
├── chatbot/           # Django Backend
└── chatbot-frontend/  # React Frontend
```

## ⚡ Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd chatbot
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   *(Note: Ensure you have a `requirements.txt` file. If not, install core dependencies manually)*
   ```bash
   pip install django djangorestframework django-cors-headers pillow
   # Or if requirements.txt exists:
   # pip install -r requirements.txt
   ```

5. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd chatbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
