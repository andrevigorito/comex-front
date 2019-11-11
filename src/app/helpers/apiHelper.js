/* eslint-disable class-methods-use-this */
import API from '../services/api';
import UserAuthenticated, * as authHelper from './authHelper';

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
      // console.log(tokenDecrypted);

      return {
        isAuth: true,
        username: tokenDecrypted.user.name,
        useruuid: tokenDecrypted.user.uuid,
        photo,
        status: authData.status,
      };
    }
    return { isAuth: false, status: authData.status };
  } catch (err) {
    const { data, status } = err.response;
    let response = { isAuth: false, status };
    console.log(data);

    if (typeof data === 'object' && ['error'] in data)
      response = { ...response, error: data.error };

    return response;
  }
}

//  O history.push('/') esta sendo usado por conta da falta de
//  padrao no projeto, que dificulta a realização de um procedimento de segurança
//  e autenticação decente. Por isso, o push é feito para que a rota '/'
//  gerencie essa parte de fazer logout se necessário, pois lá que fica a função

// wrappers de funcoes da api
export async function APIget(url, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    UserAuthenticated.userLogged = false;
    return false;
  }

  return API.get(url, config);
}

export async function APIpost(url, data = null, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    UserAuthenticated.userLogged = false;
    return false;
  }

  return API.post(url, data, config);
}

export async function APIput(url, data = null, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    UserAuthenticated.userLogged = false;
    return false;
  }

  return API.put(url, data, config);
}

export async function APIdelete(url, config = null) {
  if (!(await authHelper.verifyLoggedUserIsValid())) {
    UserAuthenticated.userLogged = false;
    return false;
  }

  return API.delete(url, config);
}
