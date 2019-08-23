import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Images

import iconTitleDash from '../img/icons/title-dash.png';
import iconUser from '../img/user-header.png';
import iconRemetente from '../img/icons/icon-nf-remetente.png';
import iconMap from '../img/icons/icon-nf-map.png';
import iconBarco from '../img/icons/icon-barco.png';
import iconAir from '../img/icons/icon-air.png';
import iconBack from '../img/icons/back.png';

// Components

class Detalhe extends Component {
  static propTypes = {
    onRemoveProduct: PropTypes.func.isRequired,
    product: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  componentDidMount() {
    const acc = document.getElementsByClassName('accordion');
    let i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function() {
        this.classList.toggle('active');
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  }

  render() {
    const { onRemoveProduct, product } = this.props;

    // let total = 0;

    // const adicionaTotal = valor => {
    //   total += valor;
    // };

    // const zeraTotal = () => {
    //   total = 0;
    // };

    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconTitleDash} alt="" />
              Gerencial
            </h1>
            <div className="last-wrap">
              <div className="btnvoltar" onClick={onRemoveProduct}>
                <img src={iconBack} alt="" />
                <p>Voltar</p>
              </div>
            </div>
          </div>

          <div className="content-regerencial">
            <div className="page-interna">
              <header className="title">
                <div className="first">
                  <p>
                    ID: <strong>{product.product_id}</strong>
                  </p>
                  <p>
                    Produto: <strong>{product.product_description}</strong>
                  </p>
                </div>
                <div className="last">
                  <p className="emp">{product.consignee.split(' ')[0]}</p>
                </div>
              </header>

              <div className="list-po">
                <div className="header">
                  <p>PO</p>
                  <p>Item</p>
                  <p>GR Programado</p>
                  <p>Qtd.</p>
                  <p>Valor</p>
                </div>

                {product.pos.map(po => (
                  <div key={po.uuid}>
                    <div className="item accordion">
                      <p>{po.order_reference}</p>
                      <p>{po.po_items.item}</p>
                      <p>
                        {new Date(po.po_items.gr_actual).toLocaleDateString()}
                      </p>
                      <p>{po.po_items.qty}</p>
                      <p>
                        {po.po_items.reduce(
                          (total, obj) => obj.invoice_value + total,
                          0
                        )}
                      </p>
                    </div>

                    <div className="panel">
                      {po.po_items.map(accordion => (
                        <div className="content-po " key={accordion.uuid}>
                          <header>
                            <div className="gra">
                              <p>Modal:</p>
                              <p>{accordion.modal}</p>
                            </div>
                            <div className="historico">
                              <div className="hist-tit">
                                <p>Último Histórico</p>
                                <p className="date">
                                  {accordion.last_update
                                    ? new Date(
                                        accordion.last_update
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
                                  <p className="user">Roberta Beltran</p>
                                  <p>{accordion.notes}</p>
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
                                  <p>{accordion.shipper}</p>
                                </div>
                                <div className="row">
                                  <p>Origem:</p>
                                  <p>{accordion.shipper_address}</p>
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
                                  <p>{accordion.origin}</p>
                                </div>
                                <div className="row">
                                  <p>Destino:</p>
                                  <p>{accordion.destination}</p>
                                </div>
                              </div>
                            </div>
                            <div className="box">
                              <div className="icon">
                                <img
                                  src={
                                    accordion.modal === 'Ocean Import'
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
                                    {accordion.etd_date
                                      ? new Date(
                                          accordion.etd_date
                                        ).toLocaleDateString()
                                      : '-'}
                                  </p>
                                </div>
                                <div className="row">
                                  <p>ATD - Prev. Chegada:</p>
                                  <p>
                                    {accordion.ata_date
                                      ? new Date(
                                          accordion.ata_date
                                        ).toLocaleDateString()
                                      : '-'}
                                  </p>
                                </div>
                                <div className="row">
                                  <p>GR - Prev. Entrega:</p>
                                  <p>
                                    {' '}
                                    {accordion.eta_date
                                      ? new Date(
                                          accordion.eta_date
                                        ).toLocaleDateString()
                                      : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="box-transportadora">
                            <p className="tit">
                              Tranportadora: <span>{accordion.carrier}</span>
                            </p>
                            <div className="line-status">
                              <div className="position">
                                <div
                                  className={
                                    accordion.process_status ===
                                    '1 - PRE-Embarque'
                                      ? 'boll atual'
                                      : 'boll'
                                  }
                                />
                                <div
                                  className={
                                    accordion.process_status ===
                                    '2 - Em Transito'
                                      ? 'boll atual'
                                      : 'boll'
                                  }
                                />
                                <div
                                  className={
                                    accordion.process_status ===
                                    '3 - PRE-Embarque'
                                      ? 'boll atual'
                                      : 'boll'
                                  }
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
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Detalhe;
