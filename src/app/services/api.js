import axios from 'axios';
import Parameters from './parameters';

export default axios.create({
  baseURL: Parameters.URL_API,
  // baseURL: `http://localhost:4000`,
});
