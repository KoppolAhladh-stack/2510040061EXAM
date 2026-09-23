# SensorGrid Backend API

RESTful API backend for SensorGrid monitoring system built with Node.js and Express.

## Features
- **GET /api/sensors**: Fetches real-time sensor metrics (temperature, humidity, pressure, water level).
- **POST /api/sensors**: Receives and validates incoming sensor readings from IoT devices.
- **Middleware**: Integrated `express.json()` and `cors()` for secure cross-origin communication.

## Quick Start
```bash
# Install dependencies
npm install

# Start the server
npm start
```
