import React, { Component } from 'react';
import * as API from '../helpers/apiHelper';

// Components
import Loading from './components/Loading';
import JustifieContainer from './Justifies/justifieContainer';
import history from '../services/history';

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
    this.getPoItem();
  }

  getPoItem = async () => {
    this.setState({ isLoading: true });
    const { uuid } = this.props.match.params;
    const response = await API.APIget(`poItems/${uuid}`);
    if (response) {
      const deop = response.data;
      console.log(deop);
      this.setState({
        deop,
        uuid,
      });
    }

    this.setState({ isLoading: false });
  };

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
              <div className="btnvoltar" onClick={() => history.goBack()}>
                <img src={iconBack} alt="" />
                <p>Voltar</p>
              </div>
            </div>
          </div>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            <div className="content-regerencial">
              <div className="page-interna">
                <header
                  className={
                    deop.process_critical === 'YES' ? 'title yes' : 'title'
                  }
                >
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
                            <p>{deop.po ? deop.po.product.consignee : ''}</p>
                          </div>
                          <div className="row">
                            <p>Porto Destino:</p>
                            <p>{deop.destination}</p>
                          </div>
                          <div className="row">
                            <p>Planta Destino:</p>
                            <p>
                              {deop.plant_destiny === '47.180.625/0021-90'
                                ? 'DOW - FR. ROCHA'
                                : deop.plant_destiny === '47.180.625/0019-75'
                                ? 'DOW - MOGI MIRIM'
                                : deop.plant_destiny === '47.180.625/0020-09'
                                ? 'DOW - JACAREI'
                                : deop.plant_destiny === '47.180.625/0022-70'
                                ? 'DOW - IBIPORA'
                                : deop.plant_destiny === '61.064.929/0001-79'
                                ? 'DUPONT - BARUERI'
                                : deop.plant_destiny === '61.064.929/0072-62'
                                ? 'DUPONT - IBIPORA'
                                : deop.plant_destiny === '61.064.929/0076-96'
                                ? 'DUPONT - PAULINIA'
                                : '-'}
                            </p>
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
                            <p>ETA:</p>
                            <p>
                              {new Date(deop.eta_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="row">
                            <p>GR Atual</p>
                            <p>
                              {new Date(deop.gr_actual).toLocaleDateString()}
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
                        <div className="date-leg">
                          <p>
                            {deop.booking_confirmation_date
                              ? new Date(
                                  deop.booking_confirmation_date
                                ).toLocaleDateString()
                              : ' '}
                          </p>
                          <p>
                            {deop.atd_date
                              ? new Date(deop.atd_date).toLocaleDateString()
                              : ''}
                          </p>
                          <p>
                            {deop.ata_date
                              ? new Date(deop.ata_date).toLocaleDateString()
                              : ''}
                          </p>
                          <p>
                            {deop.port_entry_date
                              ? new Date(
                                  deop.port_entry_date
                                ).toLocaleDateString()
                              : '-'}
                          </p>
                          <p>
                            {deop.data_do_registro_da_di
                              ? new Date(
                                  deop.data_do_registro_da_di
                                ).toLocaleDateString()
                              : ' '}
                          </p>
                          <p>
                            {deop.nf_date
                              ? new Date(deop.nf_date).toLocaleDateString()
                              : ' '}
                          </p>
                          <p>
                            {deop.loading_at_the_terminal
                              ? new Date(
                                  deop.loading_at_the_terminal
                                ).toLocaleDateString()
                              : ' '}
                          </p>
                          <p>
                            {deop.plant_delivery
                              ? new Date(
                                  deop.plant_delivery
                                ).toLocaleDateString()
                              : ' '}
                          </p>
                          <p>
                            {deop.gr_effective
                              ? new Date(deop.gr_effective).toLocaleDateString()
                              : ' '}
                          </p>
                        </div>
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
                          <p>Confirmação Booking</p>
                          <p>ATD</p>
                          <p>ATA</p>
                          <p>Porty Entry</p>
                          <p>Registro DI</p>
                          <p>NF</p>
                          <p>
                            Transito
                            <br />
                            (Loading terminal)
                          </p>
                          <p>chegada planta</p>
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
