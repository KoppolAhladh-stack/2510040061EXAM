const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser middleware
app.use(cors());
app.use(express.json());

// In-memory store for SensorGrid readings
let sensorData = {
    temperature: 28.5,  // in °C
    humidity: 65.0,     // in %
    pressure: 1012.3,   // in hPa
    waterLevel: 72.0    // in cm or %
};

// Root endpoint: API status & metadata
app.get("/", (req, res) => {
    res.json({
        service: "SensorGrid API",
        version: "1.0.0",
        endpoints: {
            "GET /api/sensors": "Fetch current sensor readings (temperature, humidity, pressure, waterLevel)",
            "POST /api/sensors": "Submit updated sensor telemetry in JSON format"
        }
    });
});

// 1. GET /api/sensors - Return JSON for temperature, humidity, pressure and water level
app.get("/api/sensors", (req, res) => {
    res.status(200).json(sensorData);
});

// 2. POST /api/sensors - Accept sensor reading in JSON format and return suitable response
app.post("/api/sensors", (req, res) => {
    const { temperature, humidity, pressure, waterLevel, water_level } = req.body;

    // Validate that at least one metric is provided
    const resolvedWaterLevel = waterLevel !== undefined ? waterLevel : water_level;
    if (
        temperature === undefined &&
        humidity === undefined &&
        pressure === undefined &&
        resolvedWaterLevel === undefined
    ) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Request body must contain at least one sensor metric (temperature, humidity, pressure, waterLevel)."
        });
    }

    // Update the sensor state with provided values
    if (temperature !== undefined) sensorData.temperature = Number(temperature);
    if (humidity !== undefined) sensorData.humidity = Number(humidity);
    if (pressure !== undefined) sensorData.pressure = Number(pressure);
    if (resolvedWaterLevel !== undefined) sensorData.waterLevel = Number(resolvedWaterLevel);

    return res.status(201).json({
        message: "Sensor reading received successfully",
        receivedAt: new Date().toISOString(),
        currentData: sensorData
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`SensorGrid API running on port ${PORT}`);
    console.log(`GET  http://localhost:${PORT}/api/sensors`);
    console.log(`POST http://localhost:${PORT}/api/sensors`);
    console.log(`=========================================`);
});
