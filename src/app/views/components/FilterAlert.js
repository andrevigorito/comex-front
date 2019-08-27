import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Grid, Row, Col } from 'react-flexbox-grid';

import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

class Filter extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
  };

  render() {
    const {
      startDate,
      endDate,
    } = this.state;

    return (
      <div className="filter-box">
        <form className="filtealert">
          <Grid>
            <Row>
              <Col xs={12} md={4}>
                <div className="item">
                  <label>Data do Alerta:</label>
                  <span>
                    <DatePicker
                      locale="pt-BR"
                      selected={startDate}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      onChange={this.handleChangeDateAta}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="De"
                    />

                    <DatePicker
                      locale="pt-BR"
                      selected={endDate}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      onChange={this.handleChangeDateAtaFim}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Até"
                    />
                  </span>
                </div>
              </Col>

              <Col xs={12} md={3}>
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
                  <label>Status:</label>
                  <select>
                    <option>Não lido</option>
                    <option>lido</option>
                    <option>Todos</option>
                  </select>
                </div>
              </Col>

              <Col xs={12} md={3}>
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
