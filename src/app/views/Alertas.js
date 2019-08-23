/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API from '../services/api';

// Images
import iconTitleAlert from '../img/icons/title-alert.png';

// Components
import Loading from './components/Loading';
import FilterAlert from './components/FilterAlert';

export default function Alertas({ useruuid }) {
  const [alerts, setalerts] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  async function getAlerts() {
    // const useruuid = '12430f8a-e492-4efb-a8cd-bb2b2784567c';
    setisLoading(true);
    const res = await API.get(`alerts/user/all/${useruuid}`);
    // console.log('##################');
    // console.log(res.data);
    setalerts(res.data);
    setisLoading(false);
  }

  async function markAlertAsRead(alertuuid) {
    await API.put(`alerts/read/`, {
      useruuid,
      alertuuid,
    });
    await getAlerts();
  }

  useEffect(() => {
    getAlerts();
  }, []);

  function btnFilter() {
    const filter = document.querySelector('.filter-box');
    filter.classList.toggle('active');
    const btn = document.querySelector('.btn-filter-nfs');
    btn.classList.toggle('active');
  }

  return (
    <div>
      <div className="center">
        <div className="page-header">
          <h1>
            <img src={iconTitleAlert} alt="" />
            Alertas
          </h1>
          <div className="last-wrap">
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

        <FilterAlert />

        <div className="list-alerts">
          <div className="header">
            <p>Data Alerta</p>
            <p>Mensagem</p>
            <p>Lido</p>
            <p>Data Leitura</p>
            <p>Marcar como lido</p>
          </div>
          {isLoading && <Loading />}
          {alerts.map(alerta => (
            <div className="item" key={alerta.uuid}>
              <p className="date current">
                {new Date(alerta.createdAt).toLocaleDateString()}
              </p>
              <p className="po">{alerta.message}</p>
              <p className="po">
                {alerta.user_alerts[0]
                  ? alerta.user_alerts[0].read
                    ? 'Sim'
                    : 'Não'
                  : ''}
              </p>
              <p className="altered date">
                {alerta.user_alerts[0]
                  ? alerta.user_alerts[0].read
                    ? new Date(
                        alerta.user_alerts[0].updatedAt
                      ).toLocaleDateString()
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
                      onClick={() => markAlertAsRead(alerta.uuid)}
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
    </div>
  );
}
