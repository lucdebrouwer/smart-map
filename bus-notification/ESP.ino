#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include <string.h>

const char* http_site = "http://ictdebrouwer.nl/bus/stop";
const int http_port = 80;

void setup() {
	// Connnect to wifi
	WiFi.begin("testtest", "seufen10");

	// Wait until connection is made 
	while (WiFi.status() != WL_CONNECTED){
		delay(500);
	}

	// Set LED pin as output
	pinMode(2, OUTPUT);
}

void loop() {
	HTTPClient http; // Create HTTPClient class
	http.begin(http_site); // Specify request destination
	int httpCode = http.GET(); // Send GET request
	if (httpCode > 0) { // Check the returning code
		String payload = http.getString(); // Get the message body
		const char *str = payload.c_str(); // Convert to char array for compatibility function strstr()

		if(strstr(str, "0") != NULL){ // If payload contains '0'
			digitalWrite(2, LOW); // Turn off led
		} else if(strstr(str, "1") != NULL){ // If payload contains '1'
			digitalWrite(2, HIGH); // Turn led on
		}
	}
	http.end(); // Close connection
	delay(10000); // Wait for 10 seconds
}
