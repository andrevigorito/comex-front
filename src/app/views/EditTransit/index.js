import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik, Field } from 'formik';
import swal from '@sweetalert/with-react';

import { ContentTransit, Loadingbtn } from './styles';

import api from '../../services/api';
import history from '../../services/history';
import iconBack from '../../img/icons/back.png';

const handleSubmit = () => async (values, { setSubmitting, resetForm }) => {
  const { uuid } = values;
  const response = await api.put(`/transitTime/${uuid}`, values);

  if (response.status === 200) {
    setSubmitting(false);
    resetForm();
    swal('Concluído', 'Transit Time Alterado com sucesso!', 'success');
    history.push('/transit');
  } else {
    console.log('aqui');
    setSubmitting(false);
    swal('Erro', 'Não foi possível alterar o Transit Time!', 'error');
  }
};

const handleValidate = ({ cnpj, modal, origin, destination, transit }) => {
  const errors = {};

  if (!cnpj) errors.cnpj = 'Cnpj Obrigatório';
  if (!modal) errors.modal = 'Modal Obrigatório';
  if (!origin) errors.origin = 'Origin Obrigatório';
  if (!destination) errors.destination = 'Destination Obrigatório';
  if (!transit) errors.transit = 'Transit Obrigatório';

  return errors;
};

const EditTransitTime = props => {
  const [cnpj, setCnpj] = useState('');
  const [modal, setModal] = useState('Air Import');
  const [origin, setOrigin] = useState('origin');
  const [destination, setDestination] = useState('destination');
  const [transit, setTransit] = useState('transit');
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    async function loadTransitTime() {
      const { uuid } = props.match.params;
      const response = await api.get(`/transitTime/${uuid}`);

      setCnpj(response.data.cnpj);
      setModal(response.data.modal);
      setOrigin(response.data.origin);
      setDestination(response.data.destination);
      setTransit(response.data.transit);
      setUuid(uuid);
    }

    loadTransitTime();
  }, []);

  return (
    <div className="center">
      <div className="page-header">
        <h1>Transit Time</h1>
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
            cnpj,
            modal,
            origin,
            destination,
            transit,
            uuid,
          }}
          validate={handleValidate}
          onSubmit={handleSubmit(props)}
        >
          {props => (
            <Form>
              <Grid>
                <Row>
                  <Col xs={12} md={6}>
                    <input
                      type="hidden"
                      name="uuid"
                      value={props.values.uuid}
                      onChange={props.handleChange}
                    />
                    <div className="item">
                      <label>CNPJ:</label>
                      <input
                        type="text"
                        name="cnpj"
                        value={props.values.cnpj}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        maxLength={8}
                        style={{
                          borderColor:
                            props.errors.cnpj && props.touched.cnpj && 'red',
                        }}
                      />
                      {props.errors.cnpj && props.touched.cnpj && (
                        <div className="erro">{props.errors.cnpj}</div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="item">
                      <label>Modal:</label>
                      <Field
                        id="type"
                        name="modal"
                        component="select"
                        value={props.values.modal}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={{
                          borderColor:
                            props.errors.modal && props.touched.modal && 'red',
                        }}
                      >
                        <option value="">Selecione um Modal</option>
                        <option value="Air Import">Air Import</option>
                        <option value="Ocean Import">Ocean Import</option>
                      </Field>
                      {props.errors.modal && props.touched.modal && (
                        <div className="erro">{props.errors.modal}</div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={5}>
                    <div className="item">
                      <label>Origin:</label>
                      <input
                        type="text"
                        name="origin"
                        value={props.values.origin}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={{
                          borderColor:
                            props.errors.origin &&
                            props.touched.origin &&
                            'red',
                        }}
                      />
                      {props.errors.origin && props.touched.origin && (
                        <div className="erro">{props.errors.origin}</div>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={5}>
                    <div className="item">
                      <label>Destination:</label>
                      <input
                        type="text"
                        name="destination"
                        value={props.values.destination}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={{
                          borderColor:
                            props.errors.destination &&
                            props.touched.destination &&
                            'red',
                        }}
                      />
                      {props.errors.destination &&
                        props.touched.destination && (
                          <div className="erro">{props.errors.destination}</div>
                        )}
                    </div>
                  </Col>
                  <Col xs={12} md={2}>
                    <div className="item">
                      <label>Transit:</label>
                      <input
                        type="number"
                        name="transit"
                        value={props.values.transit}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        style={{
                          borderColor:
                            props.errors.transit &&
                            props.touched.transit &&
                            'red',
                        }}
                      />
                      {props.errors.transit && props.touched.transit && (
                        <div className="erro">{props.errors.transit}</div>
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

export default EditTransitTime;
