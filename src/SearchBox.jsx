import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from "react";
import "./SearchBox.css";

export default function SearchBox({ updateInfo }) {
    let [city, setCity] = useState("");
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");

    let getweatherinfo = async () => {
        try {
            setLoading(true);
            setError("");

            let api = "4b482c7b7269524ab6a554ac84868d45";

            let response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`
            );

            let jsonresponse = await response.json();

            if (jsonresponse.cod !== 200) {
                setError("City not found ❌");
                setLoading(false);
                return;
            }

            let result = {
                city: jsonresponse.name,
                temp: jsonresponse.main.temp,
                tempmin: jsonresponse.main.temp_min,
                tempmax: jsonresponse.main.temp_max,
                humidity: jsonresponse.main.humidity,
                feelsLike: jsonresponse.main.feels_like,
                weather: jsonresponse.weather[0].main,
            };

            setLoading(false);
            return result;

        } catch (err) {
            console.log("Error:", err);
            setError("Something went wrong ⚠️");
            setLoading(false);
        }
    };

    let handleChange = (event) => {
        setCity(event.target.value);
    };

    let handlesubmit = async (event) => {
        event.preventDefault();
        let newinfo = await getweatherinfo();
        if (newinfo) updateInfo(newinfo);
        setCity("");
    };

    return (
        <div className='search-container'>
            <div className='search-card'>
                <h2>🌤️ Weather Finder</h2>
                <p>Enter city name to get weather updates</p>

                <form onSubmit={handlesubmit} className="search-form">

                    <TextField
                        label="City Name"
                        variant="outlined"
                        fullWidth
                        value={city}
                        onChange={handleChange}
                        required
                    />

                    <Button 
                        variant="contained" 
                        type="submit"
                        className="search-btn"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                    </Button>

                    {error && <p className="error">{error}</p>}

                </form>
            </div>
        </div>
    );
}