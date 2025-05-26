import axios from 'axios';

const API_KEY = process.env.ACCUWEATHER_API_KEY || '';
const BASE_URL = 'http://dataservice.accuweather.com';

export async function getLocationKey(city: string) {
    const url = `${BASE_URL}/locations/v1/cities/search`;
    const response = await axios.get(url, {
        params: { apikey: API_KEY, q: city }
    });
    if (response.data.length > 0) {
        return response.data[0].Key;
    }
    throw new Error('Location not found');
}

export async function getCurrentWeather(locationKey: string) {
    const url = `${BASE_URL}/currentconditions/v1/${locationKey}`;
    const response = await axios.get(url, {
        params: { apikey: API_KEY }
    });
    return response.data[0];
}