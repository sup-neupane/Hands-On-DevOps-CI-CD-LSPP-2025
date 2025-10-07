# Calculator DevOps

## Project Overview
This is a simple calculator web application built for demonstrating DevOps CI/CD practices. The app supports basic arithmetic operations, power, and square root calculations, and exposes an HTTP API for integration testing.

## Features
- Addition, subtraction, multiplication, division
- Power and square root operations
- API endpoint for calculations (/calculate)
- Health check endpoint (/health)
- Unit and integration tests included
- Dockerized for deployment

## Installation

1. Clone the repository:

2. Install dependencies:
   npm install

## Usage

Start the application locally:

   npm start

The server will run on http://localhost:3000.

## API Endpoints

### Health Check
GET /health

Response:
{
  "status": "healthy"
}

### Calculate
POST /calculate
Content-Type: application/json

Request Body Example:
{
  "operation": "add",
  "num1": 5,
  "num2": 3
}

Response Example:
{
  "result": 8
}

## Testing

Run unit and integration tests:

   npm test

Tests include:
- Unit tests for calculator operations
- Integration tests for API endpoints

## Docker

Build and run Docker image:

   docker build -t calculator-devops:latest .
   docker run -p 3000:3000 calculator-devops:latest

## CI/CD

This project includes a GitHub Actions workflow for:
- Running unit and integration tests
- Building and testing Docker images

