import SearchBox from './SearchBox';
import InfoBox from "./InfoBox";
import { useState } from "react";
import "./Weatherapp.css";

export default function Weatherapp(){

    const [weatherinfo, setWeatherinfo] = useState({
        city: "delhi",
        feelsLike: 24.2,
        temp: 25.5,
        tempmax: 35,
        tempmin: 20,
        humidity: 27,
        weather: "Haze",
    });

    const [darkMode, setDarkMode] = useState(false);

    const updateInfo = (newinfo) =>{
        setWeatherinfo(newinfo);
    };

    return(
        <div className={darkMode ? "app dark" : "app"}>

            {/* Toggle */}
            <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="toggle-btn"
            >
                {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            {/* MAIN CARD */}
            <div className="main-card">

                <h2>🌦️ Weather Finder</h2>
                <p className="subtitle">
                    Enter city name to get weather updates
                </p>

                {/* Search */}
                <SearchBox updateInfo={updateInfo}/>

                {/* Weather Info */}
                <div className="weather-ui">
                    <InfoBox information={weatherinfo}/>
                </div>

            </div>

        </div>
    );
}