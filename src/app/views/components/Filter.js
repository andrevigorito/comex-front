import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import ptBR from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', ptBR);

class Filter extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
  };

  handleChangeStart = date => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeEnd = date => {
    this.setState({
      endDate: date,
    });
  };

  render() {
    return (
      <div className="filter-box">
        <form action="">
          <div className="nfs">
            <label>
              <input type="checkbox" name="" id="dupont" />
              DUPONT
            </label>
            <label>
              <input type="checkbox" name="" id="dow" />
              DOW
            </label>
          </div>
          <div className="item">
            <label>ID / Produto:</label>
            <input type="text" id="idproduto" />
          </div>
          <div className="item">
            <label>Data início:</label>
            {/* <input type="text" className="datepicker-here date" data-language="pt-BR" id="data-inicio" /> */}
            <DatePicker
              locale="pt-BR"
              selected={this.state.startDate}
              selectsStart
              onChange={this.handleChangeStart}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              dateFormat="d MMMM , yyyy "
            />
          </div>
          <div className="item">
            <label>Data fim:</label>
            {/* <input type="text" className="datepicker-here date" data-language="pt-BR" id="data-fim" /> */}
            <DatePicker
              locale="pt-BR"
              selected={this.state.endDate}
              selectsEnd
              onChange={this.handleChangeEnd}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              dateFormat="d MMMM , yyyy "
              minDate={this.state.startDate}
            />
          </div>
          <div className="item">
            <label>Urgente:</label>
            <div className="boxurgente">
              <label>
                <input type="checkbox" name="" id="urgente-sim" />Y
              </label>
              <label>
                <input type="checkbox" name="" id="urgente-nao" />N
              </label>
            </div>
          </div>
          <div className="item">
            <label> &nbsp; </label>
            <button className="btn">Filtrar</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Filter;
