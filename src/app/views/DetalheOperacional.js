import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// Components
import Loading from './components/Loading';

// Images
import iconOperacional from '../img/icons/title-ope.png';
import iconUser from '../img/user-header.png';
import iconRemetente from '../img/icons/icon-nf-remetente.png';
import iconMap from '../img/icons/icon-nf-map.png';
import iconBarco from '../img/icons/icon-barco.png';
import iconAir from '../img/icons/icon-air.png';
import iconBack from '../img/icons/back.png';

// Components

class DetalheOperacional extends Component {
  state = {
    deop: [],
    isLoading: false,
  };

  async componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const { uuid } = this.props.match.params;
    const res = await API.get(`poItems/${uuid}`);
    const deop = res.data;
    console.log(deop);
    this.setState({
      deop,
      isLoading: false,
    });
  }

  render() {
    const { deop } = this.state;
    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconOperacional} alt="" />
              Operacional
            </h1>
            <div className="last-wrap">
              <Link to="/operacional">
                <div className="btnvoltar">
                  <img src={iconBack} alt="" />
                  <p>Voltar</p>
                </div>
              </Link>
            </div>
          </div>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            <div className="content-regerencial">
              <div className="page-interna">
                <header className="title">
                  <div className="first">
                    <p>
                      PO:
                      <strong>
                        {' '}
                        {deop.po
                          ? `${deop.po.order_reference} - ${deop.item}`
                          : ''}{' '}
                      </strong>
                    </p>
                    <p>
                      Produto:{' '}
                      <strong>
                        {deop.po ? deop.po.product.product_description : ''}
                      </strong>
                    </p>
                  </div>
                  <div className="last">
                    <p className="emp">Qtd: {deop.qty}</p>
                  </div>
                </header>

                <div className="list-po">
                  <div>
                    <div className="content-po ">
                      <header>
                        <div className="gra">
                          <p>Modal:</p>
                          <p>{deop.modal}</p>
                        </div>
                        <div className="historico">
                          <div className="hist-tit">
                            <p>Último Histórico</p>
                            <p className="date">
                              {deop.last_update
                                ? new Date(
                                    deop.last_update
                                  ).toLocaleDateString()
                                : '-'}
                            </p>
                          </div>
                          <div className="boll">
                            <span />
                          </div>
                          <div className="infouser">
                            <img src={iconUser} alt="" />
                            <div className="info">
                              <p>{deop.last_historic}</p>
                            </div>
                          </div>
                        </div>
                      </header>
                      <div className="boxs">
                        <div className="box">
                          <div className="icon">
                            <img src={iconRemetente} alt="" />
                            <p>Remetente</p>
                          </div>
                          <div className="info">
                            <div className="row">
                              <p>Razão Social:</p>
                              <p>{deop.shipper}</p>
                            </div>
                            <div className="row">
                              <p>Origem:</p>
                              <p>{deop.origin}</p>
                            </div>
                          </div>
                        </div>
                        <div className="box">
                          <div className="icon">
                            <img src={iconMap} alt="" />
                            <p>Destinatário</p>
                          </div>
                          <div className="info">
                            <div className="row">
                              <p>Razão Social:</p>
                              <p>1</p>
                            </div>
                            <div className="row">
                              <p>Destino:</p>
                              <p>{deop.destination}</p>
                            </div>
                          </div>
                        </div>
                        <div className="box">
                          <div className="icon">
                            <img
                              src={
                                deop.modal === 'Ocean Import'
                                  ? iconBarco
                                  : iconAir
                              }
                              alt=""
                            />
                            <p>Previsões</p>
                          </div>
                          <div className="info">
                            <div className="row">
                              <p>ETD - Prev. Embarque:</p>
                              <p>
                                {new Date(deop.etd_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="row">
                              <p>ATD - Prev. Chegada:</p>
                              <p>
                                {new Date(deop.atd_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="row">
                              <p>GR - Prev. Entrega:</p>
                              <p>
                                {new Date(
                                  deop.gr_requested_date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="box-transportadora">
                        <p className="tit">
                          Tranportadora: <span>{deop.carrier}</span>
                        </p>
                        <div className="line-status">
                          <div className="position">
                            <div
                              className={
                                !deop.ata_date && !deop.gr_actual
                                  ? 'boll atual'
                                  : 'boll'
                              }
                            />
                            <div
                              className={
                                deop.ata_date && !deop.gr_actual
                                  ? 'boll atual'
                                  : 'boll'
                              }
                            />
                            <div
                              className={deop.gr_actual ? 'boll atual' : 'boll'}
                            />
                          </div>
                          <div className="legenda">
                            <p>Embarque</p>
                            <p>Chegada Porto/Aeroporto</p>
                            <p>Chegada na Planta</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DetalheOperacional;
