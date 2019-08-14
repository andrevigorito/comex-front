import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

import InputMask from 'react-input-mask';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { NewUsuario, BtnMostrar } from './styles';
import getCroppedImg from './cropImage';
import api from '../../services/api';

import iconBack from '../../img/icons/back.png';

// eslint-disable-next-line react/prefer-stateless-function

export default function NovoUsuario({ history }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [mailAlert, setMailAlert] = useState(false);
  const [wppAlert, setWppAlert] = useState(false);
  const [smsAlert, setSmsAlert] = useState(false);

  const [type, setType] = useState('password');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(4 / 4);

  function getBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result);
    reader.onerror = error => console.log('Error: ', error);
  }

  async function addUser() {
    const croppedPhoto = await getCroppedImg(photo, croppedAreaPixels);

    const data = {
      user: {
        username,
        password,
        name,
        phone, // Deixar apenas numeros inteiros
        admin: isAdmin,
        mailAlert,
        wppAlert,
        smsAlert,
        photo: croppedPhoto,
      },
    };

    const response = await api.post(`users`, data);
    // console.log(data);
    // verificar se deu tudo certo
    if (response.status === 200) {
      history.push('/usuarios');
    }
  }

  function showHide(e) {
    e.preventDefault();
    e.stopPropagation();

    let newType;

    if (type === 'text') {
      newType = 'password';
    } else {
      newType = 'text';
    }

    setType(newType);
  }

  return (
    <div className="center">
      <div className="page-header">
        <h1>Novo Usuário</h1>
        <div className="last-wrap">
          <div className="btnvoltar" onClick={() => history.goBack()}>
            <img src={iconBack} alt="" />
            <p>Voltar</p>
          </div>
        </div>
      </div>
      <NewUsuario>
        <form>
          <Grid>
            <Row>
              <Col xs={12}>
                <div className="nfs item">
                  <label>
                    <input
                      type="checkbox"
                      name=""
                      id="checkAdmin"
                      value={isAdmin}
                      onChange={() => setIsAdmin(!isAdmin)}
                    />
                    Administrador
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <div className="item">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Digite o seu nome"
                    id="nu-name"
                  />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="item">
                  <label>Telefone:</label>
                  <InputMask
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Digite o seu telefone"
                    mask="(99) 99999-9999"
                    maskChar=" "
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <div className="item">
                  <label>E-mail:</label>
                  <input
                    type="email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Digite o e-mail"
                    id="txtemail"
                  />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="item">
                  <label>Senha:</label>
                  <input
                    type={type}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Digite a senha"
                    id="txtpassword"
                  />
                  <BtnMostrar
                    type="button"
                    className={type === 'text' ? 'hide' : 'show'}
                    onClick={showHide}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="item">
                  <label>Foto de perfil:</label>
                  <input
                    type="file"
                    id="imguser"
                    onChange={e => {
                      getBase64(e.target.files[0], result => {
                        setPhoto(result);
                      });
                      console.log(e.target.files[0]);
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={3}>
                <div className="nfs item">
                  <label>Notificações:</label>
                  <label>
                    <input
                      type="checkbox"
                      id="notemail"
                      onChange={() => setMailAlert(!mailAlert)}
                    />
                    E-mail
                  </label>
                </div>
              </Col>
              <Col xs={12} md={3}>
                <div className="nfs item">
                  <label>&nbsp;</label>
                  <label>
                    <input
                      type="checkbox"
                      id="notwhats"
                      onChange={() => setWppAlert(!wppAlert)}
                    />
                    WhatsApp
                  </label>
                </div>
              </Col>
              <Col xs={12} md={3}>
                <div className="nfs item">
                  <label>&nbsp;</label>
                  <label>
                    <input
                      type="checkbox"
                      id="notsms"
                      onChange={() => setSmsAlert(!smsAlert)}
                    />
                    SMS
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="item">
                  <button type="button" onClick={addUser} className="btn">
                    Cadastrar
                  </button>
                </div>
              </Col>
            </Row>
          </Grid>
        </form>
        <div className="boxcroped">
          <Cropper
            image={photo}
            crop={crop}
            aspect={aspect}
            onCropChange={newCrop => {
              setCrop(newCrop);
            }}
            onCropComplete={(croppedArea, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            // onZoomChange={onZoomChange}
          />
        </div>
      </NewUsuario>
    </div>
  );
}
