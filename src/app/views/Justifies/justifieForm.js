import React, { Fragment } from 'react';
import { Form, Formik, Field } from 'formik';
import styled from 'styled-components';
import imgloading from '../../img/load.gif';

const Loadingbtn = styled.div`
  width: 44px;
  height: 44px;
  background: url(${imgloading}) no-repeat center;
  display: none;
`;

const handleValidate = ({ type, email, description }) => {
  const errors = {};

  if (!type) errors.type = 'Selecione um tipo';
  if (!email) errors.email = 'E-mail inválido';
  if (!description) errors.description = 'Mensagem obrigatória';

  return errors;
};

const handleSubmit = props => async (values, { setSubmitting, resetForm }) => {
  await props.onJustifieCreation({ ...values });
  setSubmitting(false);
  resetForm();
};

const JustifieForm = props => {
  const { typesJustifies } = props;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        type: '',
        email: '',
        description: '',
      }}
      validate={handleValidate}
      onSubmit={handleSubmit(props)}
    >
      {props => (
        <Form className="form-just">
          <div className="row c2">
            <div className="item">
              <label htmlFor="type">Tipo</label>
              <Field
                id="type"
                name="type"
                component="select"
                value={props.values.type}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor: props.errors.type && props.touched.type && 'red',
                }}
              >
                <option value="">Selecione um tipo</option>
                {typesJustifies &&
                  typesJustifies.length > 0 &&
                  typesJustifies.map(typesJustifie => (
                    <Fragment>
                      <option value={typesJustifie.name}>
                        {typesJustifie.name}
                      </option>
                    </Fragment>
                  ))}
              </Field>
              {props.errors.type && props.touched.type && (
                <div className="erro">{props.errors.type}</div>
              )}
            </div>

            <div className="item">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={props.values.email}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor:
                    props.errors.email && props.touched.email && 'red',
                }}
              />
              {props.errors.email && props.touched.email && (
                <div className="erro">{props.errors.email}</div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="item">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                type="description"
                value={props.values.description}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor:
                    props.errors.description &&
                    props.touched.description &&
                    'red',
                }}
              />
              {props.errors.description && props.touched.description && (
                <div className="erro">{props.errors.description}</div>
              )}
            </div>
          </div>

          <button
            variant="contained"
            type="submit"
            disabled={props.isSubmitting}
            className={props.isSubmitting ? 'btn loading' : 'btn'}
          >
            <Loadingbtn className="loadingbtn" />
            Salvar
          </button>
          <button
            variant="contained"
            type="reset"
            onClick={props.handleReset}
            disabled={!props.dirty || props.isSubmitting}
            className="btn cancel"
          >
            Cancelar
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default JustifieForm;
