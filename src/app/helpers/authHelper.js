import jwt from 'jsonwebtoken';
import cryptoJS from 'crypto-js';
import env from './envConfig';
import API from '../services/api';

function getTokenDecrypted() {
  try {
    const token = localStorage.getItem('@JWT');

    if (!token) return false;

    const decrypted = cryptoJS.AES.decrypt(token, env.JWT_SECRET);
    // console.log('decrypted.toString(cryptoJS.enc.Utf8)');
    // console.log(decrypted.toString(cryptoJS.enc.Utf8));

    return decrypted.toString(cryptoJS.enc.Utf8);
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function verifyTokenIsValid() {
  try {
    const jwtObject = getTokenDecrypted();
    // console.log('jwtObject');
    // console.log(jwtObject);

    if (!jwtObject) return false;
    jwt.verify(jwtObject, env.JWT_SECRET);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function saveToken(token) {
  const JWTencrypted = cryptoJS.AES.encrypt(token, env.JWT_SECRET);
  localStorage.setItem('@JWT', JWTencrypted.toString());

  // seta o header padrão de auth com o token acima
  API.defaults.headers.Authorization = `Bearer ${token}`;
}

/**
 * Pega o payload do token e decodifica para poder ler os dados do usuário.
 * @returns { {user: { uuid, admin, name, phone, csr_name }} }
 */
export function getTokenData() {
  const jwtObject = getTokenDecrypted();
  console.log(jwt.decode(jwtObject));

  return jwt.decode(jwtObject);
  // payload do token:
  // { user: { uuid, admin, name, phone, csr_name } }
}

export async function verifyLoggedUserIsValid() {
  try {
    if (!verifyTokenIsValid()) {
      return false;
    }
    const token = getTokenDecrypted();
    API.defaults.headers.Authorization = `Bearer ${token}`;

    const { uuid } = getTokenData().user;

    // uuid: 3382ea59-5e46-4169-9d84-fe3ddf181161
    await API.get(`users/${uuid}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    return true;
  } catch (err) {
    console.log(err.response);
    return false;
  }
}
