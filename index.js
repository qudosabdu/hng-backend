const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;
const openWeatherApiKey = process.env.API_KEY;

app.get("/", (req, res) => {
  res.send("please visit /api/hello");
});

// Define your API endpoint
app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || 'Guest';

    // Get client's IP address (for testing, using a placeholder IP)
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7); // Strip IPv4 mapped prefix for IPv6
    }

    // Mocking IP geolocation data for local testing
    let city = 'Unknown';
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      city = 'New York'; // Example city for local testing
    } else {
      // Replace with a reliable IP geolocation service
      const ipInfo = await axios.get(`http://ip-api.com/json/${clientIp}`);
      city = ipInfo.data.city || 'Unknown';
    }

    // Fetch current temperature using OpenWeatherMap API
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherApiKey}`);
    const temperature = weatherResponse.data.main.temp;

    // Construct the response object
    const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`;

    // Send JSON response
    res.json({
      client_ip: clientIp,
      location: city,
      greeting: greeting
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
