import axios from 'axios';

const ducku = axios.create({
  baseURL: 'https://api-duckwho.xyz',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default ducku;
