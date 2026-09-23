/*
 * SensorGrid - ESP32 State Sequence LED Controller
 * Task: Control ESP32 LED from a programmed state sequence:
 *       - NORMAL = Blink slowly (1000ms ON, 1000ms OFF)
 *       - ALERT  = Blink rapidly (150ms ON, 150ms OFF)
 *
 * Pinout:
 *   - ESP32 GPIO 2 (D2) -> 220 Ohm Resistor -> Red LED Anode (+)
 *   - Red LED Cathode (-) -> ESP32 GND
 */

#define LED_PIN 2

// System State Definition
enum SystemState {
    STATE_NORMAL,
    STATE_ALERT
};

// Current active state
SystemState currentState = STATE_NORMAL;

// Timing parameters (in milliseconds)
const unsigned long NORMAL_BLINK_INTERVAL = 1000; // Slow blink: 1s ON, 1s OFF
const unsigned long ALERT_BLINK_INTERVAL  = 150;  // Rapid blink: 150ms ON, 150ms OFF

// Duration to stay in each programmed state before switching
const unsigned long NORMAL_STATE_DURATION = 6000; // 6 seconds in NORMAL mode
const unsigned long ALERT_STATE_DURATION  = 4000; // 4 seconds in ALERT mode

// Timestamp trackers for non-blocking execution
unsigned long lastBlinkTime = 0;
unsigned long lastStateSwitchTime = 0;
bool ledState = LOW;

void setup() {
    Serial.begin(115200);
    delay(1000); // Allow serial monitor to stabilize

    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);

    Serial.println("==================================================");
    Serial.println(" SensorGrid IoT - ESP32 State Sequence Controller");
    Serial.println(" Pin Configuration: GPIO 2 -> Resistor -> Red LED");
    Serial.println(" Sequence: NORMAL (Slow Blink) -> ALERT (Fast Blink)");
    Serial.println("==================================================");

    printStateChange(currentState);
}

void loop() {
    unsigned long currentMillis = millis();

    // 1. Programmed State Sequence Manager
    if (currentState == STATE_NORMAL) {
        if (currentMillis - lastStateSwitchTime >= NORMAL_STATE_DURATION) {
            currentState = STATE_ALERT;
            lastStateSwitchTime = currentMillis;
            printStateChange(currentState);
        }
    } else if (currentState == STATE_ALERT) {
        if (currentMillis - lastStateSwitchTime >= ALERT_STATE_DURATION) {
            currentState = STATE_NORMAL;
            lastStateSwitchTime = currentMillis;
            printStateChange(currentState);
        }
    }

    // 2. LED Blink Rate Controller based on current state
    unsigned long currentBlinkInterval = (currentState == STATE_NORMAL) 
                                         ? NORMAL_BLINK_INTERVAL 
                                         : ALERT_BLINK_INTERVAL;

    if (currentMillis - lastBlinkTime >= currentBlinkInterval) {
        lastBlinkTime = currentMillis;
        ledState = !ledState;
        digitalWrite(LED_PIN, ledState);

        // Optional telemetry print
        // Serial.printf("Time: %lu ms | State: %s | LED: %s\n", 
        //     currentMillis, 
        //     (currentState == STATE_NORMAL ? "NORMAL" : "ALERT"), 
        //     (ledState ? "ON" : "OFF")
        // );
    }
}

void printStateChange(SystemState state) {
    Serial.println("\n--------------------------------------------------");
    if (state == STATE_NORMAL) {
        Serial.println("[STATE CHANGE] >> Current State: NORMAL");
        Serial.println("Behavior: Environmental conditions normal. Blinking SLOWLY (1000ms interval).");
    } else {
        Serial.println("[STATE CHANGE] >> Current State: ALERT!");
        Serial.println("Behavior: Threshold breach detected! Blinking RAPIDLY (150ms interval).");
    }
    Serial.println("--------------------------------------------------");
}
