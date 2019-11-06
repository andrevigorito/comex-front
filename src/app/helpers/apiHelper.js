// import jwt from 'jsonwebtoken';
// import cryptoJS from 'crypto-js';
// import env from './envConfig';
import history from '../services/history';
import API from '../services/api';
import * as authHelper from './authHelper';

export async function loginUserAPI(username, password) {
  try {
    const authData = await API.post(
      `auth/login`,
      { username, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // console.log('authData');
    // console.log(authData);
    const photo = authData.data.user.photo ? authData.data.user.photo : '';

    if (authData.data.token) {
      authHelper.saveToken(authData.data.token);
      localStorage.setItem('USER_PHOTO', photo);
    }

    if (authHelper.verifyTokenIsValid()) {
      const tokenDecrypted = authHelper.getTokenData();
      console.log(tokenDecrypted);

      return {
        isAuth: true,
        username: tokenDecrypted.user.name,
        useruuid: tokenDecrypted.user.uuid,
        photo,
      };
    }
    return { isAuth: false, status: authData.status };
  } catch (err) {
    const { data, status } = err.response;
    let response = { isAuth: false, status };
    if (['error'] in data) response = { ...response, error: data.error };

    return response;
  }
}

export async function APIget(url, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    history.push('/');
    return false;
  }

  return API.get(url, config);
}

export async function APIpost(url, data = null, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    history.push('/');
    return false;
  }

  return API.post(url, data, config);
}

export async function APIput(url, data = null, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    history.push('/');
    return false;
  }

  return API.put(url, data, config);
}

export async function APIdelete(url, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    history.push('/');
    return false;
  }

  return API.delete(url, config);
}
