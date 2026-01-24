# Task List Frontend

A modern React-based frontend application for task management that communicates with a backend via REST API.

## Features

- ✅ Task creation, editing, and deletion
- ✅ Task completion tracking
- ✅ Responsive Bootstrap UI
- ✅ REST API integration with backend
- ✅ Docker containerization
- ✅ Modern React with hooks
- ✅ Axios for HTTP requests

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client
- **Docker** - Containerization

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend API URL

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Docker Deployment

### Build and run with Docker Compose

1. Make sure your backend is running and accessible
2. Update `docker-compose.yml` with correct backend configuration
3. Build and start the services:
   ```bash
   docker-compose up --build
   ```

The frontend will be available at `http://localhost:3000`

### Build Docker image manually

```bash
docker build -t task-list-frontend .
docker run -p 3000:3000 -e REACT_APP_API_URL=http://your-backend-url/api task-list-frontend
```

## API Integration

The application communicates with the backend through REST API endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

Expected task object structure:
```json
{
  "id": "task-id",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2023-01-01T00:00:00Z"
}
```

## Project Structure

```
src/
├── components/
│   ├── TaskForm.jsx      # Form for creating tasks
│   ├── TaskItem.jsx      # Individual task component
│   └── TaskList.jsx      # List of tasks
├── services/
│   └── ApiService.js     # API communication service
├── App.jsx               # Main application component
├── App.css               # Application styles
├── index.css             # Global styles
└── main.jsx              # Application entry point
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL (default: `http://localhost:8000/api`)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.