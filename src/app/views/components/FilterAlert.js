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

  render() {
    const { dataDe, dataAte, status, dow, dupont } = this.state;

    return (
      <div className="filter-box">
        <form className="filtealert" onSubmit={this.handleFilter}>
          <Grid>
            <Row>
              <Col xs={12} md={3}>
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
