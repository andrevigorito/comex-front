import React, { useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik, Field } from 'formik';
import swal from '@sweetalert/with-react';
import styled from 'styled-components';
import imgloading from '../../../img/load.gif';

import api from '../../../services/api';
import history from '../../../services/history';
import iconBack from '../../../img/icons/back.png';

import { ContentTransit } from './styles';

const Loadingbtn = styled.div`
  width: 44px;
  height: 44px;
  background: url(${imgloading}) no-repeat center;
  display: none;
`;

const handleSubmit = () => async (values, { setSubmitting, resetForm }) => {
  const response = await api.post(`/typesJustification`, { ...values });

  if (response.status === 200) {
    setSubmitting(false);
    resetForm();

    swal('Concluído', ' Tipo de Justificativa Criado com sucesso!', 'success');
    history.push('/tipoJustificativa');
  } else {
    swal('Erro', 'Não foi possível criar o Tipo de Justificativa!', 'error');
  }
};

const handleValidate = ({ name }) => {
  const errors = {};

  if (!name) errors.name = 'Nome Obrigatório';

  return errors;
};

const AddTipoJustificativa = props => {
  return (
    <div className="center">
      <div className="page-header">
        <h1>Novo Tipo de Justificativa</h1>
        <div className="last-wrap">
          <div className="btnvoltar" onClick={() => history.goBack()}>
            <img src={iconBack} alt="" />
            <p>Voltar</p>
          </div>
        </div>
      </div>

      <ContentTransit>
        <Formik
          enableReinitialize
          initialValues={{
            name: '',
          }}
          validate={handleValidate}
          onSubmit={handleSubmit(props)}
        >
          {props => (
            <Form>
              <Grid>
                <Row>
                  <Col xs={12} md={12}>
                    <div className="item">
                      <label>Nome:</label>
                      <input
                        type="text"
                        name="name"
                        value={props.values.name}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={{
                          borderColor:
                            props.errors.name && props.touched.name && 'red',
                        }}
                      />
                      {props.errors.name && props.touched.name && (
                        <div className="erro">{props.errors.name}</div>
                      )}
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
                        Salvar
                      </button>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </Form>
          )}
        </Formik>
      </ContentTransit>
    </div>
  );
};

export default AddTipoJustificativa;
