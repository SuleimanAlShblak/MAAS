import { useEffect, useState } from 'react';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  summary: string;
}

function App() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    fetch('https://localhost:5001/weatherforecast') 
      .then(response => response.json())
      .then(data => setForecasts(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Backend Data:</h1>
      <ul>
        {forecasts.map((f, index) => (
          <li key={index}>{f.date}: {f.temperatureC}°C - {f.summary}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;