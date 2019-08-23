import React, { useState } from 'react';

import styled from 'styled-components';

import Cropper from 'react-easy-crop';
import { Form, Formik } from 'formik';
import InputMask from 'react-input-mask';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { NewUsuario, BtnMostrar } from './styles';
import getCroppedImg from './cropImage';
import api from '../../services/api';

import iconBack from '../../img/icons/back.png';
import imgloading from '../../img/load.gif';

const Loadingbtn = styled.div`
  width: 44px;
  height: 44px;
  background: url(${imgloading}) no-repeat center;
  display: none;
`;

// eslint-disable-next-line react/prefer-stateless-function

export default function NovoUsuario(props, { history }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [mailAlert, setMailAlert] = useState(false);
  const [wppAlert, setWppAlert] = useState(false);
  const [smsAlert, setSmsAlert] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const [type, setType] = useState('password');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(4 / 4);

  function getBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result);
    reader.onerror = error => console.log('Error: ', error);
  }

  // async function addUser() {
  //   const croppedPhoto = await getCroppedImg(photo, croppedAreaPixels);

  //   const data = {
  //     user: {
  //       username,
  //       password,
  //       name,
  //       phone,
  //       admin: isAdmin,
  //       mailAlert,
  //       wppAlert,
  //       smsAlert,
  //       photo: croppedPhoto,
  //     },
  //   };

  //   const response = await api.post(`users`, data);

  //   if (response.status === 200) {
  //     history.push('/usuarios');
  //   }
  // }

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

  function handleValidate({ name, phone, username, password, photo }) {
    const errors = {};

    if (!name) errors.name = 'Nome Obrigatório';
    if (!phone) errors.phone = 'Phone Obrigatório';
    if (!username) errors.username = 'Email Obrigatório';
    if (!password) errors.password = 'Password Obrigatório';
    if (!photo) errors.photo = 'Password Obrigatório';

    return errors;
  }

  function handleSubmit(values) {
    console.log('values')
    console.log(values);
    // const { uuid, name } = values;
    // const response = await api.put(`/typesJustification/${uuid}`, { name });
    // if (response.status === 200) {
    //   setSubmitting(false);
    //   resetForm();
    //   swal(
    //     'Concluído',
    //     ' Tipo de Justificativa Alterado com sucesso!',
    //     'success'
    //   );
    //   history.push('/tipoJustificativa');
    // } else {
    //   swal('Erro', 'Não foi possível alterar o Tipo de Justificativa!', 'error');
    // }
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
        <Formik
          enableReinitialize
          initialValues={{
            isAdmin,
            name,
            phone,
            username,
            password,
            mailAlert,
            wppAlert,
            smsAlert,
          }}
          validate={handleValidate}
          onSubmit={handleSubmit(props)}
        >
          {props => (
            <Form >
              <Grid>
                <Row>
                  <Col xs={12}>
                    <div className="nfs item">
                      <label>
                        <input
                          type="checkbox"
                          name="isAdmin"
                          id="checkAdmin"
                          value={props.values.isAdmin}
                          onChange={props.handleChange}
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
                        name="name"
                        value={props.values.name}
                        onChange={props.handleChange}
                        placeholder="Digite o seu nome"
                        id="nu-name"
                      />
                      {props.errors.name && props.touched.name && (
                        <div className="erro">{props.errors.name}</div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="item">
                      <label>Telefone:</label>
                      <InputMask
                        name="phone"
                        value={props.values.phone}
                        onChange={props.handleChange}
                        placeholder="Digite o seu telefone"
                        mask="(99) 99999-9999"
                        maskChar=" "
                      />
                      {props.errors.phone && props.touched.phone && (
                        <div className="erro">{props.errors.phone}</div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <div className="item">
                      <label>E-mail:</label>
                      <input
                        type="email"
                        name="username"
                        value={props.values.username}
                        onChange={props.handleChange}
                        placeholder="Digite o e-mail"
                        id="txtemail"
                      />
                      {props.errors.username && props.touched.username && (
                        <div className="erro">{props.errors.username}</div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="item">
                      <label>Senha:</label>
                      <input
                        type={type}
                        name="password"
                        value={props.values.password}
                        onChange={props.handleChange}
                        placeholder="Digite a senha"
                        id="txtpassword"
                      />
                      <BtnMostrar
                        type="button"
                        className={type === 'text' ? 'hide' : 'show'}
                        onClick={showHide}
                      />
                      {props.errors.password && props.touched.password && (
                        <div className="erro">{props.errors.password}</div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  {/* <Col xs={12}>
                    <div className="item">
                      <label>Foto de perfil:</label>
                      <input
                        name="photo"
                        type="file"
                        id="imguser"
                        onChange={e => {
                          getBase64(e.target.files[0], result => {
                            setPhoto(result);
                          });
                        }}
                      />
                    </div>
                  </Col> */}
                </Row>

                <Row>
                  <Col xs={12} md={3}>
                    <div className="nfs item">
                      <label>Notificações:</label>
                      <label>
                        <input
                          type="checkbox"
                          id="notemail"
                          value={props.values.mailAlert}
                          onChange={props.handleChange}
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
                          value={props.values.wppAlert}
                          onChange={props.handleChange}
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
                          value={props.values.smsAlert}
                          onChange={props.handleChange}
                        />
                        SMS
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="item">
                      <button
                        variant="contained"
                        type="submit"
                        disabled={props.isSubmitting}
                        className={props.isSubmitting ? 'btn loading' : 'btn'}
                      >
                        <Loadingbtn className="loadingbtn" />
                        Cadastrar
                      </button>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </Form>
          )}
        </Formik>
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
