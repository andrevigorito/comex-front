import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

// Images
import iconTitle from '../img/icons/title-gerencial.png';
import iconRgc from '../img/icons/rg-c.png';
import iconRgp from '../img/icons/rg-p.png';

// Components
import Loading from './components/Loading';

class List extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    products: PropTypes.shape(PropTypes.any).isRequired,
    // onDetail: PropTypes.func.isRequired,
  };

  state = {
    title: 'Painel Gerencial',
    dupont: false,
    dow: false,
    produto: '',
    startDate: '',
    endDate: '',
    types: [],
    responsible: '',
  };

  btnFilter = () => {
    const filter = document.querySelector('.filter-box');
    filter.classList.toggle('active');
    const btn = document.querySelector('.btn-filter-nfs');
    btn.classList.toggle('active');
  };

  handleCheckboxDupont = () => {
    const { dupont } = this.state;
    this.setState({ dupont: !dupont });
  };

  handleChangeStart = date => {
    this.setState({ startDate: date });
  };

  handleChangeEnd = date => {
    this.setState({ endDate: date });
  };

  handleCheckboxDow = () => {
    const { dow } = this.state;
    this.setState({ dow: !dow });
  };

  handleFormSubit = () => {
    const { dupont } = this.state;
    this.setState({ dupont: !dupont });
  };

  handleProduto = e => {
    this.setState({ produto: e.target.value });
  };

  handleResponsible = e => {
    this.setState({ responsible: e.target.value });
  };

  handleTypes = async e => {
    // console.log(e.target.value);

    const { value, checked } = e.target;
    const { types: oldStateTypes } = this.state;
    const index = oldStateTypes.indexOf(value);
    if (index >= 0 && !checked) {
      oldStateTypes.splice(index, 1);
      await this.setState({ types: [...oldStateTypes] });
    } else if (checked) {
      await this.setState({ types: [...oldStateTypes, value] });
    }
  };

  handleFormSubit = e => {
    e.preventDefault();
    const { produto, dow, dupont, startDate, endDate, types, responsible } = this.state;

    const { onFilter } = this.props;

    const params = {
      produto,
      responsible,
    };

    if (dow) {
      params.dow = 'dow';
    }

    if (dupont) {
      params.dupont = 'dupont';
    }

    if (startDate) {
      params.dataDe = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    if (endDate) {
      params.dataAte = format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    if (types) {
      params.types = types;
    }

    onFilter(params);
  };

  render() {
    const { isLoading, products } = this.props;
    const { types } = this.state;
    let total = 0;

    // const adicionaTotal = valor => {
    //   total += valor;
    // };

    const zeraTotal = () => {
      total = 0;
    };

    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconTitle} alt="" />
              {this.state.title}
            </h1>

            <div className="last-wrap">
              <div className="btn-filter-nfs" onClick={this.btnFilter}>
                <div className="icon-filter">
                  <span />
                  <span />
                  <span />
                </div>
                Filtrar
              </div>
            </div>
          </div>

          <div className="filter-box">
            <form action="" onSubmit={this.handleFormSubit}>
              <div className="status">
                <div className="item">
                  <label>Processo Status:</label>
                  <div className="boxurgente">
                    <label>
                      <input
                        type="checkbox"
                        value="1 - PRE-Embarque"
                        checked={!!types.includes('1 - PRE-Embarque')}
                        onChange={this.handleTypes}
                      />
                      Pré Embarque
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="2 - Em Transito"
                        checked={!!types.includes('2 - Em Transito')}
                        onChange={this.handleTypes}
                      />
                      Em trânsito
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="3 - Nacionalização"
                        checked={!!types.includes('3 - Nacionalização')}
                        onChange={this.handleTypes}
                      />
                      Nacionalização
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="4 - Faturamento"
                        checked={!!types.includes('4 - Faturamento')}
                        onChange={this.handleTypes}
                      />
                      Faturamento
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="5 - Processo Encerrado"
                        checked={!!types.includes('5 - Processo Encerrado')}
                        onChange={this.handleTypes}
                      />
                      Processo encerrado
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="8 - Close Financial Item"
                        checked={!!types.includes('8 - Close Financial Item')}
                        onChange={this.handleTypes}
                      />
                      Close financial item
                    </label>
                  </div>
                </div>
              </div>
              <div className="nfs">
                <label>
                  <input
                    type="checkbox"
                    name=""
                    id="dupont"
                    onChange={this.handleCheckboxDupont}
                  />
                  DUPONT
                </label>
                <label>
                  <input
                    type="checkbox"
                    name=""
                    id="dow"
                    onChange={this.handleCheckboxDow}
                  />
                  DOW
                </label>
              </div>
              <div className="item">
                <label>ID / Produto:</label>
                <input
                  type="text"
                  id="idproduto"
                  onChange={this.handleProduto}
                />
              </div>
              <div className="item">
                <label>CSR ou Planejador:</label>
                <input
                  type="text"
                  id="idproduto"
                  onChange={this.handleResponsible}
                />
              </div>
              <div className="item">
                <label>Data início GR Efetivo:</label>
                {/* <input type="text" className="datepicker-here date" data-language="pt-BR" id="data-inicio" /> */}
                <DatePicker
                  locale="pt-BR"
                  selected={this.state.startDate}
                  selectsStart
                  onChange={this.handleChangeStart}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="item">
                <label>Data fim GR Efetivo:</label>
                {/* <input type="text" className="datepicker-here date" data-language="pt-BR" id="data-fim" /> */}
                <DatePicker
                  locale="pt-BR"
                  selected={this.state.endDate}
                  selectsEnd
                  onChange={this.handleChangeEnd}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  dateFormat="dd/MM/yyyy"
                // minDate={this.state.startDate}
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
                <button type="submit" className="btn">
                  Filtrar
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="center">
          <div className="content-regerencial">
            <div className="list-rege">
              <header className="headerlist">
                <div className="first">
                  <p>ID / Produto</p>
                  <p>GR Atual</p>
                </div>
              </header>

              {isLoading && <Loading />}
              {products.map(product => (
                <div
                  className={` ${product.product_id ? 'item urgent' : 'item'}`}
                  key={product.uuid}
                // onClick={() => onDetail(product.uuid)}
                >
                  <div className="main-info">
                    <p className="emp">{product.consignee.split(' ')[0]}</p>
                    <p className="idpro">{product.product_id}</p>
                    <p className="namepro">
                      {product.product_description.substring(0, 20)}
                    </p>
                    {/* <p className="namepro">{product.name}</p> */}
                  </div>

                  <div className="info">
                    <div className="list-gra">
                      {product.items.map(po => (
                        <div
                          className={po.alert ? 'item-gra alert' : 'item-gra'}
                          key={po.uuid}
                        >
                          <p>
                            <img src={iconRgc} alt="" />{' '}
                            <strong>
                              {new Date(po.gr_actual).toLocaleDateString()}
                            </strong>
                          </p>
                          <p>
                            <img src={iconRgp} alt="" />{' '}
                            {po.total ? po.total.toLocaleString() : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="item-total">
                      <p>
                        <strong>Total</strong>
                      </p>
                      <p>
                        <img src={iconRgp} alt="" />
                        {product.totalProduto
                          ? product.totalProduto.toLocaleString()
                          : ''}
                      </p>
                      {zeraTotal()}
                    </div>
                    <div className="item-total">
                      <p>
                        <strong>Total Recebido</strong>
                      </p>
                      <p>
                        <img src={iconRgp} alt="" />
                        {product.totalProduto
                          ? product.totalProduto.toLocaleString()
                          : ''}
                      </p>
                      {zeraTotal()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
