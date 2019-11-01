/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import API from '../services/api';
import history from '../services/history';

// Images
import iconTitleAlert from '../img/icons/title-alert.png';
// Components
import Loading from './components/Loading';
import FilterAlert from './components/FilterAlert';
import ExportExcel from './components/ExportExcel';

export default function Alertas({ useruuid, location }) {
  const [alerts, setalerts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [contadorAlertas, setContadorAlertas] = useState(0);

  async function getAlerts(params = null) {
    setisLoading(true);

    // se houver filtros, exibir o componente filtro
    // nao vai funcionar por causa da gambiarra do querySelector que
    // deveria ser um STATE
    // if (params) btnFilter();

    console.log('data param enviado ->', params);
    const res = await API.get(`/alerts/user/all/${useruuid}`, { params });
    // console.log(`alerts/user/all/${useruuid}`);
    // console.log(res.data);

    setalerts(res.data);
    setContadorAlertas(res.data.length);
    setisLoading(false);
    console.log('qtd de alertas:', res.data.length);
  }

  async function markAlertAsRead(alertuuid) {
    await API.put(`alerts/read/`, {
      useruuid,
      alertuuid,
    });
    await getAlerts();
  }

  // o fetch de dados agora é feito APENAS pelo FilterAlert
  // useEffect(() => {
  //   // getAlerts();
  // }, []);

  // favor, futuramente deixar de usar querySelector
  // que não é o ideal num framework como o React.
  // na pagina operacional tem isso feito com states.
  function btnFilter() {
    const filter = document.querySelector('.filter-box');
    filter.classList.toggle('active');
    const btn = document.querySelector('.btn-filter-nfs');
    btn.classList.toggle('active');
  }

  async function filtrar(data) {
    await getAlerts(data);
  }

  const arrayExcel = [];
  const csvData = arrayExcel;

  let contadorCriticos = 0;

  alerts.forEach(alert => {
    const Data = alert.createdAt
      ? new Date(alert.createdAt).toLocaleString()
      : '-';

    const Responsavel = alert.po.csr_name
      ? alert.po.csr_name.toLowerCase()
      : '';
    const Mensagem = alert.message;
    const Lido = alert.user_alerts[0].read
      ? new Date(alert.user_alerts[0].updatedAt).toLocaleString()
      : null;
    const objeto = {
      Data,
      Responsavel,
      Mensagem,
      Lido,
    };

    arrayExcel.push(objeto);

    alert.po_item.process_critical === 'YES' && contadorCriticos++;
  });

  return (
    <div className="center">
      <div className="page-header">
        <h1>
          <img src={iconTitleAlert} alt="" />
          Alertas
        </h1>
        <div className="last-wrap">
          <CSVLink data={csvData} separator=";" filename="webcol-alertas.xls">
            <ExportExcel />
          </CSVLink>
          <div className="btn-filter-nfs" onClick={btnFilter}>
            <div className="icon-filter">
              <span />
              <span />
              <span />
            </div>
            Filtrar
          </div>
        </div>
      </div>
      <div className="result-alerts">
        <span>
          Todos: <strong>{contadorAlertas}</strong>
        </span>
        <span>
          Críticos: <strong>{contadorCriticos}</strong>
        </span>
        <span>
          Favoritos: <strong>0</strong>
        </span>
      </div>

      <FilterAlert filtrar={filtrar} location={location} />

      <div className="list-alerts">
        <div className="header">
          <p>Data Alerta</p>
          <p>Responsável</p>
          <p>Mensagem</p>
          {/* <p>Lido</p> */}
          <p>Data Leitura</p>
          <p>Marcar como lido</p>
        </div>
        {isLoading && <Loading />}
        {alerts.map(alerta => (
          <div
            className="item"
            key={alerta.uuid}
            onClick={() => {
              markAlertAsRead(alerta.uuid);
              history.push(`operacional/detalhe/${alerta.poItemUuid}`);
            }}
          >
            <p className="date current">
              {new Date(alerta.createdAt).toLocaleString()}
            </p>
            <p className="responsible">{alerta.po.csr_name}</p>
            <p className="po">
              {alerta.message}{' '}
              {alerta.po_item && alerta.po_item.alert_count > 0 ? (
                <div className="box-count">{alerta.po_item.alert_count}</div>
              ) : null}
            </p>
            {/* <p className="po">
                {alerta.user_alerts[0]
                  ? alerta.user_alerts[0].read
                    ? 'Sim'
                    : 'Não'
                  : ''}
              </p> */}
            <p className="altered date">
              {alerta.user_alerts[0]
                ? alerta.user_alerts[0].read
                  ? new Date(alerta.user_alerts[0].updatedAt).toLocaleString()
                  : ''
                : ''}
            </p>
            <p>
              {alerta.user_alerts[0] ? (
                alerta.user_alerts[0].read ? (
                  ''
                ) : (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        markAlertAsRead(alerta.uuid);
                      }}
                      className="btn"
                    >
                      Marcar como lido
                  </button>
                  )
              ) : (
                  ''
                )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
