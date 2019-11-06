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
    errorMsg: '',
  };

  handleChange = field => e => {
    this.setState({
      [field]: e.target.value,
    });
  };

  login = async () => {
    let errorMsg = '';
    this.setState({ errorMsg });

    const { handleLogin } = this.props;
    const { email, passwd } = this.state;
    const response = await handleLogin(email, passwd);

    if (response.status >= 500) {
      errorMsg = `Erro interno (${response.status})`;
    } else if (response.status >= 400) {
      errorMsg = 'Usuário ou senha incorreto';
    } else {
      errorMsg = `Erro (${response.status})`;
    }
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
