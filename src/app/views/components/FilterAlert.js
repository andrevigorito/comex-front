import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Row, Col } from 'react-flexbox-grid';

import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

class Filter extends Component {
  state = {
    dataDe: new Date(),
    dataAte: new Date(),
    mensagem: '',
    status: '',
    dow: false,
    dupont: false,
    types: [],
  };

  handleFilter = async e => {
    e.preventDefault();
    await this.props.filtrar(this.state);
  };

  handleChangeDateAta = date => {
    this.setState({ dataDe: date });
  };

  handleChangeDateAtaFim = date => {
    this.setState({ dataAte: date });
  };

  handleQueryInput = e => {
    this.setState({ mensagem: e.target.value });
  };

  handleResponsibleInput = e => {
    this.setState({ responsible: e.target.value });
  };

  handleSelect = e => {
    this.setState({ status: e.target.value });
  };

  handleDow = async e => {
    await this.setState({ dow: e.target.checked });
  };

  handleDupont = async e => {
    await this.setState({ dupont: e.target.checked });
  };

  handleTypes = async e => {
    const { value, checked } = e.target;
    const { types: oldState } = this.state;
    const index = oldState.indexOf(value);
    if (index >= 0 && !checked) {
      oldState.splice(index, 1);
    } else if (checked) {
      await this.setState({ types: [...oldState, value] });
    }
    // console.log(oldState, index, checked);
    // console.log(this.state.types);
  };

  render() {
    const { dataDe, dataAte, status, dow, dupont } = this.state;

    return (
      <div className="filter-box">
        <form className="filtealert" onSubmit={this.handleFilter}>
          <Grid>
            <Row>
              <Col xs={12} md={2}>
                <div className="item">
                  <label>Empresa:</label>
                  <div className="boxstatus jcfs">
                    <label>
                      <input
                        type="checkbox"
                        name="dow"
                        value={dow}
                        id="sts-booking"
                        onChange={this.handleDow}
                      />
                      Dow
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="dupont"
                        value={dupont}
                        id="sts-booking"
                        onChange={this.handleDupont}
                      />
                      Dupont
                    </label>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={10}>
                <div className="item">
                  <label>Status:</label>
                  <div className="boxstatus jcfs">
                    <label>
                      <input
                        type="checkbox"
                        value="BOOK_ATRASO"
                        onChange={this.handleTypes}
                        id="BOOK_ATRASO"
                      />
                      Booking em atraso
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="BOOK_PROX_VENCIMENTO"
                        onChange={this.handleTypes}
                        id="BOOK_PROX_VENCIMENTO"
                      />
                      Booking perto do vencimento.
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="GR_ALTERADA"
                        onChange={this.handleTypes}
                        id="GR_ALTERADA"
                      />
                      GR Atual c/ alteração
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="DIVERG_SAP_ATL"
                        onChange={this.handleTypes}
                        id="DIVERG_SAP_ATL"
                      />
                      Diverg. SAPxATL
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="DIVERG_SAP_ATL_SEM_ACAO"
                        onChange={this.handleTypes}
                        id="DIVERG_SAP_ATL_SEM_ACAO"
                      />
                      Diverg. SAPxATL s/ ação conc.
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="PO_SEM_DATA_GR_SAP"
                        onChange={this.handleTypes}
                        id="PO_SEM_DATA_GR_SAP"
                      /> 
                      PO s/ data de GR no SAP
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="CANAL_VERMELHO"
                        onChange={this.handleTypes}
                        id="CANAL_VERMELHO"
                      />
                      Canal Vermelho.
                    </label>
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={4}>
                <div className="item">
                  <label>Data do Alerta:</label>
                  <span>
                    <DatePicker
                      locale="pt-BR"
                      selected={dataDe}
                      selectsStart
                      dataDe={dataDe}
                      dataAte={dataAte}
                      onChange={this.handleChangeDateAta}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="De"
                    />

                    <DatePicker
                      locale="pt-BR"
                      selected={dataAte}
                      selectsEnd
                      dataDe={dataDe}
                      dataAte={dataAte}
                      onChange={this.handleChangeDateAtaFim}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Até"
                    />
                  </span>
                </div>
              </Col>

              <Col xs={12} md={2}>
                <div className="item">
                  <label>Mensagem:</label>
                  <input
                    type="text"
                    id="idproduto"
                    onChange={this.handleQueryInput}
                    autoComplete="false"
                  />
                </div>
              </Col>
              <Col xs={12} md={2}>
                <div className="item">
                  <label>Responsável:</label>
                  <input
                    type="text"
                    id="idproduto"
                    onChange={this.handleResponsibleInput}
                    autoComplete="false"
                  />
                </div>
              </Col>

              <Col xs={12} md={2}>
                <div className="item">
                  <label>Status:</label>
                  <select value={status} onChange={this.handleSelect}>
                    <option value="">Todos</option>
                    <option value="false">Não lido</option>
                    <option value="true">lido</option>
                  </select>
                </div>
              </Col>

              <Col xs={12} md={2}>
                <div className="item">
                  <label> &nbsp; </label>
                  <button type="submit" className="btn">
                    Filtrar
                  </button>
                </div>
              </Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
}

export default Filter;
