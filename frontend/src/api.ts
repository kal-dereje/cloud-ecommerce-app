import axios from 'axios';
const API = axios.create({ baseURL: "https://jkcdvmn0tb.execute-api.us-east-1.amazonaws.com/prod" /*import.meta.env.VITE_API_URL*/ });
export default API;
