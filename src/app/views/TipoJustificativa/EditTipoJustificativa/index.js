import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
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
  const { uuid, name } = values;
  const response = await api.put(`/typesJustification/${uuid}`, { name });
  if (response.status === 200) {
    setSubmitting(false);
    resetForm();
    swal(
      'Concluído',
      ' Tipo de Justificativa Alterado com sucesso!',
      'success'
    );
    history.push('/tipoJustificativa');
  } else {
    swal('Erro', 'Não foi possível alterar o Tipo de Justificativa!', 'error');
  }
};

const handleValidate = ({ name }) => {
  const errors = {};

  if (!name) errors.name = 'Nome Obrigatório';

  return errors;
};

const EditTipoJustificativa = props => {
  const [name, setName] = useState('');
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    async function loadTipoJustificativa() {
      const { uuid } = props.match.params;
      const response = await api.get(`/typesJustification/${uuid}`);
      setName(response.data.name);
      setUuid(uuid);
    }
    // const { uuid: teste } = props.match.params;
    // setUuid(teste);

    loadTipoJustificativa();
  }, []);

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
            name,
            uuid,
          }}
          validate={handleValidate}
          onSubmit={handleSubmit(props, uuid)}
        >
          {props => (
            <Form>
              <Grid>
                <Row>
                  <Col xs={12} md={12}>
                    <div className="item">
                      <label>Nome:</label>
                      <input
                        type="hidden"
                        name="uuid"
                        value={props.values.uuid}
                        onChange={props.handleChange}
                      />
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

export default EditTipoJustificativa;
