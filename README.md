# SensorGrid - Set 7: Node.js/Express REST API & IoT State Control

Comprehensive solution for **SET 7** covering backend REST API services, Git branching workflows, and ESP32 microcontroller simulation.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Task 1 & 2: Node.js & Express REST Backend](#task-1--2-nodejs--express-rest-backend)
   - [Endpoints Specification](#endpoints-specification)
   - [Middleware](#middleware)
   - [Quick Start](#quick-start)
   - [Automated API Testing](#automated-api-testing)
3. [Task 3: Git Branching & Meaningful Commits](#task-3-git-branching--meaningful-commits)
   - [Branch Structure](#branch-structure)
   - [Commit History](#commit-history)
4. [Task 4: ESP32 Wokwi State Sequence Simulation](#task-4-esp32-wokwi-state-sequence-simulation)
   - [Circuit Design](#circuit-design)
   - [State Machine Behavior](#state-machine-behavior)
   - [How to Run in Wokwi](#how-to-run-in-wokwi)

---

## Project Overview
This repository contains:
- **Backend API**: An Express.js REST service exposing GET and POST `/api/sensors` with real-time in-memory telemetry state for `temperature`, `humidity`, `pressure`, and `waterLevel`.
- **Git Branching Strategy**: Fully organized with `main` and `feature/backend-api` branches using atomic, conventional commits.
- **ESP32 Simulation**: A programmed state machine running in Wokwi that toggles between `NORMAL` (slow blink) and `ALERT` (rapid blink) states with Serial feedback.

---

## Task 1 & 2: Node.js & Express REST Backend

### Endpoints Specification

#### 1. `GET /api/sensors`
- **Method**: `GET`
- **Path**: `/api/sensors`
- **Description**: Returns the latest environmental telemetry metrics in JSON format.
- **Response**: `200 OK`
```json
{
  "temperature": 28.5,
  "humidity": 65,
  "pressure": 1012.3,
  "waterLevel": 72
}
```

#### 2. `POST /api/sensors`
- **Method**: `POST`
- **Path**: `/api/sensors`
- **Headers**: `Content-Type: application/json`
- **Description**: Submits incoming sensor readings to update current SensorGrid metrics.
- **Request Body Example**:
```json
{
  "temperature": 32.4,
  "humidity": 58.2,
  "pressure": 1009.8,
  "waterLevel": 85.0
}
```
- **Response**: `201 Created`
```json
{
  "message": "Sensor reading received successfully",
  "receivedAt": "2026-09-23T09:38:35.832Z",
  "currentData": {
    "temperature": 32.4,
    "humidity": 58.2,
    "pressure": 1009.8,
    "waterLevel": 85
  }
}
```

### Middleware
- **`cors()`**: Enables Cross-Origin Resource Sharing so web clients and IoT dashboards can access the API without CORS restrictions.
- **`express.json()`**: Parses incoming JSON request bodies into `req.body`.

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run the server
npm start
```
The server will start listening at `http://localhost:5000`.

### Automated API Testing
Run the built-in test script to verify both GET and POST endpoints:
```bash
npm test
```

Or test using **cURL**:
```bash
# GET sensor readings
curl -X GET http://localhost:5000/api/sensors

# POST new reading
curl -X POST http://localhost:5000/api/sensors \
  -H "Content-Type: application/json" \
  -d "{\"temperature\":31.5,\"humidity\":60,\"pressure\":1011.2,\"waterLevel\":75}"
```

Or test using **PowerShell**:
```powershell
# GET
Invoke-RestMethod -Uri "http://localhost:5000/api/sensors" -Method Get

# POST
$body = @{ temperature = 31.5; humidity = 60; pressure = 1011.2; waterLevel = 75 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/sensors" -Method Post -Body $body -ContentType "application/json"
```

---

## Task 3: Git Branching & Meaningful Commits

### Branch Structure
- `main`: Production-ready baseline codebase.
- `feature/backend-api`: Dedicated feature branch for backend REST API implementation and verification.

### Commit History
```
* aacfa14 - test: add automated test runner for SensorGrid API endpoints
* 2a4c0ec - feat: implement GET and POST /api/sensors endpoints with express.json and cors
* e6e7a3d - chore: initial commit with project configuration and dependencies
```

---

## Task 4: ESP32 Wokwi State Sequence Simulation

Located in `esp32_simulation/`.

### Circuit Design
- **Microcontroller**: ESP32 DevKit v1
- **LED**: Red LED connected to **GPIO 2 (D2)**
- **Resistor**: 220Ω resistor connected in series between GPIO 2 and LED Anode
- **Ground**: LED Cathode connected to ESP32 **GND**

### State Machine Behavior
1. **`NORMAL` State**:
   - Condition: Normal environmental telemetry.
   - LED Behavior: **Blinks slowly** (1000ms ON, 1000ms OFF / 0.5 Hz).
   - Sequence Duration: 6 seconds.
2. **`ALERT` State**:
   - Condition: Critical sensor event (e.g. high water level / temperature threshold).
   - LED Behavior: **Blinks rapidly** (150ms ON, 150ms OFF / ~3.33 Hz).
   - Sequence Duration: 4 seconds.
3. Transitions cyclically in a programmed state sequence with timestamped logs printed to the Serial Monitor at 115200 baud.

### How to Run in Wokwi
1. Open [Wokwi ESP32 Simulator](https://wokwi.com/projects/new/esp32).
2. Replace `sketch.ino` with the contents of `esp32_simulation/sketch.ino`.
3. Replace `diagram.json` with the contents of `esp32_simulation/diagram.json`.
4. Click the green **Start Simulation** button.
5. Observe the LED switching between slow blink and rapid blink, and verify the state logs in the Serial Monitor tab.
