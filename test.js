const http = require("http");

function makeRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            });
        });

        req.on("error", (err) => reject(err));

        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log("Starting SensorGrid API Automated Tests...\n");

    try {
        // Test 1: GET /api/sensors
        console.log("1. Testing GET /api/sensors...");
        const getRes = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/sensors",
            method: "GET"
        });
        console.log(`   Status: ${getRes.statusCode}`);
        console.log(`   Payload:`, getRes.body);
        if (
            getRes.statusCode === 200 &&
            "temperature" in getRes.body &&
            "humidity" in getRes.body &&
            "pressure" in getRes.body &&
            "waterLevel" in getRes.body
        ) {
            console.log("   [PASS] GET /api/sensors returned all required sensor metrics.\n");
        } else {
            console.error("   [FAIL] GET /api/sensors response missing required fields.\n");
        }

        // Test 2: POST /api/sensors
        console.log("2. Testing POST /api/sensors with new telemetry data...");
        const postPayload = {
            temperature: 32.4,
            humidity: 58.2,
            pressure: 1009.8,
            waterLevel: 85.0
        };
        const postRes = await makeRequest(
            {
                hostname: "localhost",
                port: 5000,
                path: "/api/sensors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            },
            postPayload
        );
        console.log(`   Status: ${postRes.statusCode}`);
        console.log(`   Response:`, postRes.body);
        if (postRes.statusCode === 201 && postRes.body.currentData.temperature === 32.4) {
            console.log("   [PASS] POST /api/sensors successfully processed and updated telemetry.\n");
        } else {
            console.error("   [FAIL] POST /api/sensors failed.\n");
        }

        // Test 3: GET /api/sensors to verify updated state
        console.log("3. Verifying updated state with GET /api/sensors...");
        const verifyRes = await makeRequest({
            hostname: "localhost",
            port: 5000,
            path: "/api/sensors",
            method: "GET"
        });
        console.log(`   Updated Data:`, verifyRes.body);
        if (verifyRes.body.temperature === 32.4 && verifyRes.body.waterLevel === 85.0) {
            console.log("   [PASS] State verification succeeded! All tests passed.\n");
        } else {
            console.error("   [FAIL] Updated state does not match posted data.\n");
        }
    } catch (err) {
        console.error("Test execution error:", err.message);
        console.error("Make sure the server is running on port 5000 before running tests.");
    }
}

runTests();
