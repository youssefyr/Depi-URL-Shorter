# Frontend for URL Shortener

This project is a React application that serves as the frontend for the URL shortener backend service. It provides a user interface for shortening URLs and viewing metrics from Prometheus.

## Features

- **URL Shortening**: Users can input a URL and receive a shortened version.
- **Metrics Dashboard**: Displays metrics collected from the backend service using Prometheus.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Docker

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Docker Setup

To run the frontend application in a Docker container, follow these steps:

1. **Build the Docker Image**:
   ```bash
   docker build -t frontend .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 3000:3000 frontend
   ```

## Usage

- Navigate to `http://localhost:3000` in your web browser to access the application.
- Use the URL shortening form to shorten URLs.
- Access the metrics dashboard to view the performance metrics.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.