// 52:46  error  Must use destructuring props assignment    react/destructuring-assignment
// 52:57  error  'onLogout' is missing in props validation  react/prop-types

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Route, Link } from 'react-router-dom';
import imgUser from '../../../img/user-header.png';
import iconLogout from '../../../img/icons/icon-logout.png';

import { UserImage } from './styles';

class Menu extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    empresa: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
  };

  btnMenu = () => {
    const menu = document.querySelector('.main-menu');
    const menulink = document.querySelector('.main-menu nav a');
    menu.classList.remove('ativo');
    menulink.classList.remove('ativo');
  };

  render() {
    const { onLogout, username, empresa, photo } = this.props;

    return (
      <div className="main-menu">
        <div className="scrollmenu">
          <div className="content">
            <div className="icon-menu" onClick={this.btnMenu}>
              <span />
              <span />
              <span />
            </div>
            <div className="user">
              <UserImage src={photo} alt="" />
              <p>{username}</p>
              <p>
                <small>{empresa}</small>
              </p>
            </div>
            <nav>
              <Route>
                {/* <Link to="/meuperfil">Meu Perfil</Link>    */}
                {/* <Link onClick={this.btnMenu} to="/dashboard">
                  Dashboard
                </Link>
                <Link onClick={this.btnMenu} to="/gerencial">
                  Gerencial{' '}
                </Link>
                <Link onClick={this.btnMenu} to="/operacional">
                  Operacional{' '}
                </Link>
                <Link onClick={this.btnMenu} to="/import">
                  Import
                </Link> */}
                <Link onClick={this.btnMenu} to="/usuarios">
                  Usuários
                </Link>
                <Link onClick={this.btnMenu} to="/transit">
                  Transit Time
                </Link>
                <Link onClick={this.btnMenu} to="/alertas">
                  Alertas
                </Link>
                <Link onClick={this.btnMenu} to="/tipoJustificativa">
                  Tipos de Justificativa
                </Link>
              </Route>
            </nav>
            <div className="logout" onClick={onLogout}>
              <p>Logout</p>
              <img src={iconLogout} alt="" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
