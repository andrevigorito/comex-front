import axios from 'axios';
import env from '../helpers/envConfig';

export default axios.create({
  baseURL: env.URL_API,
});
