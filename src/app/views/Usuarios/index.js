import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import swal from '@sweetalert/with-react';

import API from '../../services/api';

// Components
import Loading from '../components/Loading';

// styles
import { Box, UserList, BtnCadastrar } from './styles';
// import { Box, UserList, Popup } from './styles';

class Usuarios extends Component {
  state = {
    users: [],
    isLoading: false,
    newusername: '',
    newpassword: '',
    newadmin: false,
    addUserForm: false,
  };

  async componentDidMount() {
    this.loadUserList();
  }

  handleChange = field => e => {
    this.setState({
      [field]: e.target.value,
    });
    // console.log(this.state.newadmin);
  };

  handleChangeAdmin = () => {
    this.setState(prevState => ({
      newadmin: !prevState.newadmin,
    }));
  };

  btnFilter = () => {
    this.setState(prevState => ({
      addUserForm: !prevState.addUserForm,
    }));
    // alert(this.state.addUserForm);
    // const filter = document.querySelector('.filter-box');
    // filter.classList.toggle('active');
    // const btn = document.querySelector('.btn-filter-nfs');
    // btn.classList.toggle('active');
  };

  // openPopupbox = () => {
  //   const content = (
  //     <Popup>
  //       <div className="content">
  //         <h2>Alterar usuário</h2>

  //         <div className="list-justificativas">
  //           <div className="item">
  //             <div className="user">
  //               <input type="checkbox" />
  //               <p>Romero Almeida</p>
  //               <p>12/07/2019 08:16:21</p>
  //               <p>XO - AGENDAMENTO</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="wrap-btns">
  //         <div className="btnclose" onClick={PopupboxManager.close}>
  //           x
  //         </div>
  //         <button type="button" className="btn abonar">
  //           Abonar
  //         </button>
  //         <button type="button" className="btn">
  //           Justificativas
  //         </button>
  //         <button type="button" className="btn">
  //           Adicionar
  //         </button>
  //       </div>
  //     </Popup>
  //   );
  //   PopupboxManager.open({ content });
  // };

  addUser = async () => {
    const { newusername, newpassword, newadmin } = this.state;

    const newUser = await API.post(`users`, {
      user: {
        username: newusername,
        password: newpassword,
        admin: newadmin,
      },
    });

    console.log(newUser);

    window.location.reload();
  };

  deleteUser = async uuid => {
    console.log(uuid);

    await API.delete(`users/${uuid}`);

    window.location.reload();
  };

  modifyUser = async uuid => {
    // alert('Tela/popup de alteração ainda não implementado');
    // this.openPopupbox();

    const confirmDelete = await swal({
      dangerMode: true,
      text: 'Confirma a exclusão do usuário?',
      buttons: {
        cancel: 'Não',
        confirm: 'Sim',
      },
    });

    if (confirmDelete) {
      this.deleteUser(uuid);
    }
  };

  async loadUserList() {
    // tem que buscar os USUARIOS
    this.setState({ isLoading: true });
    const users = await API.get(`users`);
    console.log(users.data);
    this.setState({
      users: users.data,
      isLoading: false,
    });
  }

  render() {
    // const popupboxConfig = {
    //   fadeIn: true,
    //   fadeInSpeed: 500,
    // };

    const {
      isLoading,
      users,
      addUserForm,
      newusername,
      newname,
      newtel,
      newpassword,
      newadmin,
      newfoto,
    } = this.state;
    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>Usuários</h1>
            <div className="last-wrap">
              <Link onClick={this.btnMenu} to="/usuarios/novo">
                <BtnCadastrar>Adicionar usuário</BtnCadastrar>
              </Link>
            </div>
          </div>
          <div>
            <div>
              <div className="row">
                <Box className={addUserForm && 'active'}>
                  {/* <Box className="active"> */}
                  <form action="">
                    {/* <div className="item">
                      <label>Nome:</label>
                      <input
                        type="text"
                        value={name}
                        onChange={this.handleChange('name')}
                        placeholder="Nome Completo"
                        id="txtname"
                      />
                    </div> */}
                    <div className="item">
                      <label>E-mail:</label>
                      <input
                        type="email"
                        value={newusername}
                        onChange={this.handleChange('newusername')}
                        placeholder="teste@email.com.br"
                        id="txtemail"
                      />
                    </div>

                    <div className="item">
                      <label>Senha:</label>
                      <input
                        type="password"
                        value={newpassword}
                        onChange={this.handleChange('newpassword')}
                        placeholder="Senha de Acesso"
                        id="txtpassword"
                      />
                    </div>

                    <div className="nfs">
                      <label>
                        <input
                          type="checkbox"
                          name=""
                          value={newadmin}
                          onChange={this.handleChangeAdmin}
                          id="checkAdmin"
                        />
                        Administrador
                      </label>
                    </div>
                    <div className="item">
                      <label> &nbsp; </label>
                      <button
                        type="button"
                        onClick={this.addUser}
                        className="btn"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </form>
                </Box>
              </div>
            </div>

            {/* <PopupboxContainer {...popupboxConfig} /> */}
            <UserList>
              <div className="header">
                {/* <p>Nome</p> */}
                <p>Usuário</p>
                <p>Acesso</p>
                <p>Data Criação</p>
                <p>Alterar</p>
              </div>
              {isLoading && <Loading />}
              {users.map(usuario => (
                <div className="item" key={usuario.uuid}>
                  {/* <p className="po">{usuario.nome}</p> */}
                  <p className="username">{usuario.username}</p>
                  <p className="admin">
                    {usuario.admin ? 'Administrador' : 'Usuário'}
                  </p>
                  <p className="date">
                    {new Date(usuario.createdAt).toLocaleString()}
                  </p>
                  <p className="alertmsg">
                    <button
                      type="button"
                      onClick={() => this.modifyUser(usuario.uuid)}
                      className="btn excluir"
                    >
                      Excluir
                    </button>
                  </p>
                </div>
              ))}
            </UserList>
          </div>
        </div>
      </div>
    );
  }
}

export default Usuarios;
