import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import "./InfoBox.css";

export default function InfoBox({ information }) {

    return (
        <div className="weather-ui">

            {/* Top Section */}
            <div className="top">
                <h2>{information.city}</h2>
                <p className="condition">{information.weather}</p>
            </div>

            {/* Temperature */}
            <div className="temp-section">
                <h1>{Math.round(information.temp)}°</h1>
            </div>

            {/* Bottom Glass Cards */}
            <div className="bottom">

                <div className="card">
                    <p>Feels Like</p>
                    <h3>{information.feelsLike}°C</h3>
                </div>

                <div className="card">
                    <p>Humidity</p>
                    <h3>{information.humidity}%</h3>
                </div>

                <div className="card">
                    <p>Min</p>
                    <h3>{information.tempmin}°C</h3>
                </div>

                <div className="card">
                    <p>Max</p>
                    <h3>{information.tempmax}°C</h3>
                </div>

            </div>
        </div>
    );
}