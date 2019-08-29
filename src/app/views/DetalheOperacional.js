import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

// Components
import Loading from './components/Loading';
import JustifieContainer from './Justifies/justifieContainer';

// Images
import iconOperacional from '../img/icons/title-ope.png';
import iconUser from '../img/user-header.png';
import iconRemetente from '../img/icons/icon-nf-remetente.png';
import iconMap from '../img/icons/icon-nf-map.png';
import iconBarco from '../img/icons/icon-barco.png';
import iconAir from '../img/icons/icon-air.png';
import iconBack from '../img/icons/back.png';
import checkNot from '../img/icons/check-not.png';
import checkOk from '../img/icons/check-ok.png';
import checkNull from '../img/icons/check-null.png';


// Components

class DetalheOperacional extends Component {

  state = {
    deop: [],
    isLoading: false,
    uuid: null,
  };

  async componentDidMount() {
    this.getPoItem()
  }

  getPoItem = async () => {
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
      uuid,
    });
  }

  render() {
    const { deop, uuid } = this.state;
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
                              ? new Date(deop.last_update).toLocaleDateString()
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
                            <p>{deop.shipper_address}</p>
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
                            <p>{deop.shipper}</p>
                          </div>
                          <div className="row">
                            <p>Porto Destino:</p>
                            <p>{deop.origin}</p>
                          </div>
                          <div className="row">
                            <p>Planta Destino:</p>
                            <p>-</p>
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
                            <p>ETD:</p>
                            <p>
                              {new Date(deop.etd_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="row">
                            <p>ATD:</p>
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
                          {deop.timeline
                            ? deop.timeline.map(posit => (
                                <div
                                  className={` ${
                                    posit.actual ? 'boll atual' : 'boll'
                                  } ${posit.red ? 'not' : ''} `}
                                  key={posit.step}
                                >
                                  <span />
                                </div>
                              ))
                            : null}
                        </div>
                        <div className="legenda">
                          <p>Aguardando Confirmação Booking</p>
                          <p>Aguardando ATD</p>
                          <p>Aguardando ATA</p>
                          <p>Aguardando Porty Entry</p>
                          <p>Aguardando Registro DI</p>
                          <p>Aguardando NF</p>
                          <p>
                            Transito
                            <br />
                            (Loading terminal)
                          </p>
                          <p>Aguardando chegada planta</p>
                          <p>GR efetivo</p>
                        </div>
                      </div>
                      <div className="aguardando">
                        <div
                          className={` ${
                            deop.docs_received_date_alert ? 'it not' : 'it ok'
                          }`}
                        >
                          <img
                            src={` ${
                              !deop.docs_received_date
                                ? checkNull
                                : deop.docs_received_date_alert
                                ? checkNot
                                : checkOk
                            }`}
                            alt=""
                          />
                          <span>
                            <p>Aguardando DOCS</p>
                            <p>
                              {deop.docs_received_date
                                ? new Date(
                                    deop.docs_received_date
                                  ).toLocaleDateString()
                                : '-'}
                            </p>
                          </span>
                        </div>
                        <div
                          className={` ${
                            deop.protocol_mapa_in26_date_alert
                              ? 'it not'
                              : 'it ok'
                          }`}
                        >
                          <img
                            src={` ${
                              !deop.protocol_mapa_in26_date
                                ? checkNull
                                : deop.protocol_mapa_in26_date_alert
                                ? checkNot
                                : checkOk
                            }`}
                            alt=""
                          />
                          <span>
                            <p>Aguardando Protocolo LI</p>
                            <p>
                              {deop.protocol_mapa_in26_date
                                ? new Date(
                                    deop.protocol_mapa_in26_date
                                  ).toLocaleDateString()
                                : '-'}
                            </p>
                          </span>
                        </div>
                        <div
                          className={` ${
                            deop.post_import_license_release_date_alert
                              ? 'it not'
                              : 'it ok'
                          }`}
                        >
                          <img
                            src={` ${
                              !deop.post_import_license_release_date
                                ? checkNull
                                : deop.post_import_license_release_date_alert
                                ? checkNot
                                : checkOk
                            }`}
                            alt=""
                          />
                          <span>
                            <p>Aguardando Defrimento LI</p>
                            <p>
                              {deop.post_import_license_release_date
                                ? new Date(
                                    deop.post_import_license_release_date
                                  ).toLocaleDateString()
                                : '-'}
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <JustifieContainer
                  uuid={uuid}
                  deop={deop}
                  getPoItem={this.getPoItem}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DetalheOperacional;
