import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import io from 'socket.io-client';
import API from './services/api';

import 'react-toastify/dist/ReactToastify.css';

// Views
import Detalhe from './views/Detalhe';
import Login from './views/Login';
import ProductContainer from './views/ProductContainer';
import Dashboard from './views/Dashboard';
import Import from './views/Import';
import Alertas from './views/Alertas';
import Usuarios from './views/Usuarios';
import NovoUsuario from './views/Usuarios/new';
import Operacional from './views/Operacional';
import DetalheOperacional from './views/DetalheOperacional';
import AddTransitTime from './views/AddTransit';
import EditTransitTime from './views/EditTransit';
import TransitTimeList from './views/TransitTimeList';

// Components
import Menu from './views/components/Menu/index';
import Header from './views/components/Header/index';

// Images

// Css
import './css/main.scss';

const socket = io('https://webcol.herokuapp.com');
// para testes no localhost:
// const socket = io('http://localhost:4000/');

class App extends Component {
  state = {
    isAuth: false,
    username: '',
    useruuid: '',
    photo: '',
  };

  componentDidMount() {
    const username = localStorage.getItem('USER_USERNAME');
    const useruuid = localStorage.getItem('USER_UUID');
    const photo = localStorage.getItem('USER_PHOTO');
    if (username && useruuid) {
      this.setState({
        isAuth: true,
        username,
        useruuid,
        photo,
      });
    }

    this.registerToSocket();
  }

  componentWillUnmount() {
    this.unregisterToSocket();
  }

  registerToSocket = () => {
    //socket.on('poItemAlert', newAlert => {
      // console.log('poItemAlert do WebSocket...', newAlert);
      //this.notifySucess(newAlert);
    //});

    socket.on('productsImport', () => {
      // console.log('poItemAlert do WebSocket...', newAlert);
      this.notifySucessText('Importação ATL concluída!');
    });
    
    socket.on('SapDowImport', () => {
      // console.log('poItemAlert do WebSocket...', newAlert);
      this.notifySucessText('Importação SAP DOW concluída!');
    });
    
    socket.on('SapDupontImport', () => {
      // console.log('poItemAlert do WebSocket...', newAlert);
      this.notifySucessText('Importação SAP Dupont concluída!');
    });

    //socket.on('newAlert', newAlert => {
      //const useruuid = this.getUserUuidFromState();

      // console.log('newAlert do WebSocket...', newAlert);
      // console.log('socket NewAlert: ');

      // console.log(newAlert.toAllUsers);
      // console.log(typeof newAlert.userUuid);
      // console.log(newAlert.userUuid, '//', useruuid);

      //if (newAlert.toAllUsers || newAlert.userUuid === useruuid) {
        //this.notifySucess(newAlert);
      //}
    //});
  };

  unregisterToSocket = () => {
    socket.removeListener('poItemAlert');
    socket.removeListener('newAlert');
    socket.removeListener('productsImport');
  };

  //notifySucess = alertObj => {
  //  toast.success(alertObj.message, {
  //    position: toast.POSITION.BOTTOM_RIGHT,
  //    // alterar
  //    onClick: () => this.markAlertAsRead(alertObj),
  //  });
  //};

  notifySucessText = message => {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  markAlertAsRead = async alertObj => {
    const useruuid = this.getUserUuidFromState();
    await API.put(`alerts/read/`, {
      useruuid,
      alertuuid: alertObj.uuid,
    });
    // console.log(teste);
  };

  handleLogin = async (email, passwd, lembrar = false) => {
    try {
      const logado = await API.post(
        `auth/login`,
        { username: email, password: passwd },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(logado);

      if (lembrar) {
        this.saveLocalStorage(email, logado.data.uuid, logado.data.photo);
      }

      this.setState({
        isAuth: true,
        username: email,
        useruuid: logado.data.uuid,
        photo: logado.data.photo,
      });
      // console.log('logado.data', logado.data);
    } catch (err) {
      // console.log(err);
      return err.response.status;
    }
    return true;
  };

  handleLogout = () => {
    this.setState({
      isAuth: false,
    });
    localStorage.removeItem('USER_USERNAME');
    localStorage.removeItem('USER_UUID');
    localStorage.removeItem('USER_PHOTO');
    localStorage.removeItem('USER');
  };

  /**
   * Esse método de login DEVE SER MELHORADO, pois esta solução é temporária
   * e abre brechas de segurança.
   */
  saveLocalStorage = (USERNAME, UUID, PHOTO) => {
    localStorage.setItem('USER_USERNAME', USERNAME);
    localStorage.setItem('USER_UUID', UUID);
    localStorage.setItem('USER_PHOTO', PHOTO);
  };

  /**
   * Essa função foi criada para que o `useruuid` mais recente e atualizado
   * do state seja buscado sem risco de pegar um valor vazio ou desatualizado.
   * Sem isso, ao buscar no componentDidMout, vinha vazio o state.
   */
  getUserUuidFromState = () => {
    const { useruuid } = this.state;
    return useruuid;
  };

  render() {
    const { isAuth, username, useruuid, photo } = this.state;

    return (
      <div className="App">
        <BrowserRouter>
          {!isAuth && (
            <Route
              path="*"
              render={props => (
                <Login {...props} handleLogin={this.handleLogin} />
              )}
            />
          )}

          {isAuth ? (
            <div>
              <Menu
                onLogout={this.handleLogout}
                username={username}
                empresa=""
                photo={photo}
              />
              <Header />
              <ToastContainer hideProgressBar autoClose={false} />
            </div>
          ) : null}

          <Switch>
            {isAuth && (
              <Route path="/gerencial/:uuid" exact component={Detalhe} />
            )}
            {isAuth && (
              <Route path="/gerencial" exact component={ProductContainer} />
            )}
            {isAuth && <Route path="/dashboard" exact component={Dashboard} />}
            {isAuth && <Route path="/import" exact component={Import} />}
            {isAuth && (
              <Route
                path="/alertas"
                exact
                // useruuid={useruuid}
                // component={Alertas}
                render={props => <Alertas {...props} useruuid={useruuid} />}
              />
            )}
            {isAuth && <Route path="/usuarios" exact component={Usuarios} />}
            {isAuth && (
              <Route path="/usuarios/novo" exact component={NovoUsuario} />
            )}
            {isAuth && (
              <Route path="/transit" exact component={TransitTimeList} />
            )}
            {isAuth && (
              <Route path="/novo/transit/" exact component={AddTransitTime} />
            )}
            {isAuth && (
              <Route
                path="/transit/:uuid"
                exact
                component={EditTransitTime}
                isPrivate
              />
            )}
            {isAuth && (
              <Route path="/operacional" exact component={Operacional} />
            )}
            {isAuth && (
              <Route
                path="/operacional/detalhe/:uuid"
                exact
                component={DetalheOperacional}
              />
            )}

            {isAuth && <Route path="/" exact component={ProductContainer} />}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
