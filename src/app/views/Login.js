import React, { Component } from 'react';

// Images
import logoLogin from '../img/logologin.png';

// Css
import '../css/Layout/login.scss';
import UserAuthenticated from '../helpers/authHelper';
import { loginUserAPI } from '../helpers/apiHelper';

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  };

  handleChange = field => e => {
    this.setState({
      [field]: e.target.value,
    });
  };

  handleLogin = async () => {
    let errorMsg = '';
    this.setState({ errorMsg });
    const { username, password } = this.state;

    const response = await loginUserAPI(username, password);
    UserAuthenticated.userLogged = response.isAuth;
    console.log('response');
    console.log(response);

    if (response.status >= 300) errorMsg = `Erro (${response.status})`;
    if (response.status >= 400) errorMsg = 'Usuário ou senha incorreto';
    if (response.status >= 500) errorMsg = `Erro interno (${response.status})`;

    this.setState({ errorMsg });
  };

  render() {
    const { errorMsg } = this.state;
    return (
      <section className="login">
        <div className="content-login">
          <img src={logoLogin} alt="" />
          <div className="box-login">
            <p className="tit">Corteva Agriscience</p>
            <p>Bem vindo! Digite seus dados de acesso.</p>
            <div className="main-form">
              <input
                type="text"
                name="username"
                onChange={this.handleChange('username')}
                className="first"
                placeholder="E-mail"
              />
              <input
                type="password"
                name="password"
                onChange={this.handleChange('password')}
                placeholder="Senha de Acesso"
              />

              <div className="row">
                {/* <label htmlFor="lembrame">
                  <input
                    type="checkbox"
                    id="lembrame"
                    checked={lembrar}
                    onChange={this.handleChangeLembrar}
                  />
                  Lembrar-me
                </label> */}
                <div className="esqueciminhasenha">Esqueci minha senha</div>
              </div>
              <div className="row">
                <p className="redText">{errorMsg}</p>
              </div>
              <button type="button" onClick={this.handleLogin}>
                Entrar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Login;
