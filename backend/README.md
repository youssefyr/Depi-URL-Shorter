# URL Shortener Service

This project is a simple URL shortener application that provides an API for shortening long URLs and redirecting users to the original URLs using short codes.

## Features

- Shorten long URLs and receive a short code.
- Redirect to the original URL using the short code.
- Store URL mappings in a SQLite database.

## API Endpoints

### POST /shorten

- **Description**: Accepts a long URL and returns a short code.
- **Request Body**:
  - `url`: The long URL to be shortened.
- **Response**:
  - `short_code`: The generated short code for the provided URL.

### GET /<short_code>

- **Description**: Redirects to the original long URL based on the provided short code.
- **Response**: Redirects to the long URL associated with the short code.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd url-shortener-service
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Initialize the database**:
   - Run the SQL commands in `migrations/init.sql` to set up the database schema.

4. **Run the application**:
   ```
   npm start
   ```

## Docker Setup

To run the application in a Docker container:

1. **Build the Docker image**:
   ```
   docker build -t url-shortener-service .
   ```

2. **Run the application using Docker Compose**:
   ```
   docker-compose up
   ```

## Testing

Unit tests for the URL shortener service are located in the `tests` directory. You can run the tests using:

```
npm test
```

## License

This project is licensed under the MIT License.