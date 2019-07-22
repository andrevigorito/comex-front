import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Images
import logoLogin from '../img/logologin.png';

// Css
import '../css/Layout/login.scss';

class Login extends Component {
  static propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };

  state = {
    email: '',
    passwd: '',
  };

  handleChange = field => e => {
    this.setState({
      [field]: e.target.value,
    });
  };

  login = () => {
    const { handleLogin } = this.props;
    const { email, passwd } = this.state;
    handleLogin(email, passwd);
  };

  render() {
    return (
      <section className="login">
        <div className="content-login">
          <img src={logoLogin} alt="" />
          <div className="box-login">
            <p className="tit">COL REPORT</p>
            <p>Bem vindo! Digite seus dados de acesso.</p>
            <div className="main-form">
              <input
                type="text"
                name="username"
                onChange={this.handleChange('email')}
                className="first"
                placeholder="E-mail"
              />
              <input
                type="password"
                name="password"
                onChange={this.handleChange('passwd')}
                placeholder="Senha de Acesso"
              />

              <div className="row">
                <label htmlFor="lembrame">
                  <input type="checkbox" id="lembrame" />
                  Lembrar-me
                </label>

                <div className="esqueciminhasenha">Esqueci minha senha</div>
              </div>
              <button type="button" onClick={this.login}>
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