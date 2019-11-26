import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { CSVLink } from 'react-csv';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';

import { format } from 'date-fns';
import history from '../services/history';

import { getTokenData } from '../helpers/authHelper';
import * as API from '../helpers/apiHelper';
import 'react-datepicker/dist/react-datepicker.css';

// Images
import iconOperacional from '../img/icons/title-ope.png';
import star from '../img/favourites.svg';

// Components
import Loading from './components/Loading';
import Pagination from './components/Pagination';
import ExportExcel from './components/ExportExcel';

registerLocale('pt-BR', ptBR);
// import FilterOperacional from './components/FilterOperacional';

const favoriteUserUuid = 'f4a25bfb-f6e2-4280-9f8e-cb3e14e39e9f';

class Operacional extends Component {
  initialStateFilters = {
    ataDateIncio: '',
    ataDateFim: '',
    grProgramado: '',
    grProgramadoFim: '',
    grEfetivo: '',
    grEfetivoFim: '',
    todos: false,
    atrasados: false,
    noPrazo: false,
    criticos: false,
    naoCriticos: false,
    dupont: false,
    dow: false,
    po: '',
    produto: '',
    plantaDestino: '',
    analista: '',
    item: '',
    statusTimeLine: [],
  };

  state = {
    operacional: [],
    isLoading: false,
    filtroAtivo: false,
    page: 1,
    totalPages: 1,
    totalItems: 0,
    filtros: this.initialStateFilters,
    useruuid: '',
  };

  // *********** inicio de salvamento de filtros *************
  // *********** inicio de salvamento de filtros *************
  // *********** inicio de salvamento de filtros *************

  /**
   * salva o state no `localStorage`
   */
  saveFilters = (stateObj = {}) => {
    const { filtros } = this.state;
    const newStateObj = { ...filtros, ...stateObj };

    localStorage.setItem('@operacionalFilters', JSON.stringify(newStateObj));
  };

  /**
   * pega o `localStorage` e salva no state
   */
  getFilters = () => {
    const rawFilters = localStorage.getItem('@operacionalFilters');

    if (rawFilters) {
      this.setState({ filtroAtivo: true });
      const filtersObj = JSON.parse(rawFilters);

      // console.log('filtersObj');
      // console.log(filtersObj);

      if (filtersObj.ataDateIncio)
        filtersObj.ataDateIncio = new Date(filtersObj.ataDateIncio);
      if (filtersObj.ataDateFim)
        filtersObj.ataDateFim = new Date(filtersObj.ataDateFim);
      if (filtersObj.grProgramado)
        filtersObj.grProgramado = new Date(filtersObj.grProgramado);
      if (filtersObj.grProgramadoFim)
        filtersObj.grProgramadoFim = new Date(filtersObj.grProgramadoFim);
      if (filtersObj.grEfetivo)
        filtersObj.grEfetivo = new Date(filtersObj.grEfetivo);
      if (filtersObj.grEfetivoFim)
        filtersObj.grEfetivoFim = new Date(filtersObj.grEfetivoFim);

      this.setState({ filtros: filtersObj });
      // console.log('setou state no getFilters->', filtersObj, this.state);
      // console.log('************************');
      return filtersObj;
    }
    return null;
  };

  clearFilter = async () => {
    this.saveFilters(this.initialStateFilters);
    this.getFilters();
    // await this.getPoItems(this.state);
  };

  getQueryParam = async () => {
    // queryParam de teste:
    // d
    const { location } = this.props;
    if (location.search) {
      try {
        const queryParam = JSON.parse(
          String(decodeURI(location.search)).replace('?', '')
        );

        this.saveFilters(queryParam);
        this.getFilters();
        await this.getPoItems(queryParam);
      } catch (error) {
        this.getFilters();
        console.log('error:');
        console.log(error);
      }
    } else {
      const filt = this.getFilters();
      await this.getPoItems(filt);
    }
  };

  // *********** fim de salvamento de filtros *************
  // *********** fim de salvamento de filtros *************
  // *********** fim de salvamento de filtros *************

  handleBefore = () => {
    const { page } = this.state;

    if (page > 1) {
      this.setState(prevState => ({
        page: prevState.page - 1,
      }));
    }
  };

  handleAfter = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleFirst = () => {
    this.setState({
      page: 1,
    });
  };

  handleLast = () => {
    const { totalPages } = this.state;

    this.setState({
      page: totalPages,
    });
  };

  handleFavorite = async poItemUuid => {
    if (this.state.useruuid === favoriteUserUuid) {
      this.setState({
        isLoading: true,
      });
      await API.APIpost(
        `userPoItems`,
        {
          poItemUuid,
          userUuid: this.state.useruuid,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      await this.getPoItems();
    } else {
      this.notifyError('Você não tem permissão para executar esta função!');
    }
  };

  handleUnFavorite = async favoriteUuid => {
    if (this.state.useruuid === favoriteUserUuid) {
      this.setState({
        isLoading: true,
      });
      await API.APIdelete(`userPoItems/${favoriteUuid}`);
      await this.getPoItems();
    } else {
      this.notifyError('Você não tem permissão para executar esta função!');
    }
  };

  notifyError = msg => {
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;

    if (page !== prevState.page) {
      this.getPoItems();
    }
  }

  async componentDidMount() {
    // this.getPoItems();
    // console.log('estado inicial:', this.initialStateFilters);
    this.setState({ useruuid: getTokenData().user.uuid });

    await this.getQueryParam();
  }

  async getPoItems(filtroStateObj = null) {
    this.setState({ isLoading: true });

    const { page, filtros } = this.state;

    const {
      ataDateIncio,
      ataDateFim,
      grProgramado,
      grProgramadoFim,
      grEfetivo,
      grEfetivoFim,
      todos,
      atrasados,
      noPrazo,
      criticos,
      naoCriticos,
      dupont,
      dow,
      po,
      produto,
      plantaDestino,
      analista,
      item,
      statusTimeLine,
    } = filtroStateObj || filtros;

    const params = {
      page,
      po,
      produto,
      plantaDestino,
      atrasados,
      todos,
      noPrazo,
      criticos,
      naoCriticos,
      dupont,
      dow,
      analista,
      item,
      userUuid: this.state.userUuid,
    };

    if (statusTimeLine && statusTimeLine.length !== 0) {
      params.statusTimeLine = JSON.stringify(statusTimeLine);
    }

    if (ataDateIncio) {
      params.ataDe = format(ataDateIncio, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }
    if (ataDateFim) {
      params.ataFim = format(ataDateFim, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    if (grProgramado) {
      params.grResquestedDate = format(
        grProgramado,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      );
    }
    if (grProgramadoFim) {
      params.grResquestedDateFim = format(
        grProgramadoFim,
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      );
    }

    if (grEfetivo) {
      params.grAtual = format(grEfetivo, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    if (grEfetivoFim) {
      params.grAtualFim = format(grEfetivoFim, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    // console.log('params get poItems:', params);
    const response = await API.APIget(`poItems`, { params });

    const { data: operacional, total: totalPages, count: totalItems } = response
      ? response.data
      : {};

    // console.log('registros:', totalItems);
    if (operacional && totalPages && totalItems) {
      this.setState({
        operacional,
        totalPages,
        totalItems,
      });
    }else{
      this.setState({
        operacional: [],
        totalPages: 1,
        totalItems: 0,
      });
    }

    this.setState({ isLoading: false });
  }

  handleFormSubmit = async e => {
    e.preventDefault();
    this.saveFilters();
    if (!this.props.location.search) {
      await this.getPoItems();
    } else {
      history.push('/operacional');
    }
  };

  btnFilter = () => {
    const { filtroAtivo } = this.state;
    this.setState({ filtroAtivo: !filtroAtivo });
  };

  /**
   * usar apenas para campos texto
   */
  handleTextInput = (e, stateName) => {
    const stateFilters = { ...this.state.filtros };
    stateFilters[stateName] = e.target.value;
    this.setState({ filtros: stateFilters });
  };

  /**
   * usar apenas para checkboxs
   */
  handleCheckboxGeral = (e, stateName) => {
    const stateFilters = { ...this.state.filtros };
    stateFilters[stateName] = e.target.checked;
    this.setState({ filtros: stateFilters });
  };

  handleCheckboxStatus = e => {
    const { filtros } = this.state;
    let { statusTimeLine } = filtros;

    if (e.target.checked) {
      const statusTimeLineExiste = statusTimeLine.find(
        s => s === e.target.name
      );
      if (!statusTimeLineExiste) {
        statusTimeLine = [...statusTimeLine, e.target.name];
      }
    } else {
      const statusTimeLineIndex = statusTimeLine.findIndex(
        s => s === e.target.name
      );
      statusTimeLine.splice(statusTimeLineIndex, 1);
    }

    filtros.statusTimeLine = statusTimeLine;
    this.setState({ filtros });
  };

  /**
   * usar apenas para Datepicker
   */
  handleDatePicker = (date, stateName) => {
    // console.log(date, stateName);

    const stateFilters = { ...this.state.filtros };
    stateFilters[stateName] = date;
    this.setState({ filtros: stateFilters });
  };

  render() {
    const {
      isLoading,
      operacional,
      filtroAtivo,
      page,
      totalPages,
      totalItems,
      filtros,
    } = this.state;

    const {
      ataDateIncio,
      ataDateFim,
      grProgramado,
      grProgramadoFim,
      grEfetivo,
      grEfetivoFim,
      todos,
      atrasados,
      noPrazo,
      criticos,
      naoCriticos,
      dupont,
      dow,
      po,
      produto,
      plantaDestino,
      analista,
      item,
      statusTimeLine,
    } = filtros;
    // console.log('filtros->', filtros);

    const arrayExcel = [];

    /**
     * o loop á seguir é executado a cada mudança de state,
     * causando um gasto de memória desnecessário.
     * Favor, futuramente otimizar esse processo de montagem do CSV
     * ou acionar um membro da equipe pra fazer essa modificação.
     */

    operacional.forEach(op => {
      const Item = op.item;
      const ProdutoId = op.po.product.product_id;
      const Descricao = op.po.product.product_description;
      const Quantidade = op.qty;
      const PlantaId = op.plant_id;
      const GRRequested = op.gr_requested_date
        ? new Date(op.gr_requested_date).toLocaleDateString()
        : '-';
      const GRActual = op.gr_actual
        ? new Date(op.gr_actual).toLocaleDateString()
        : '-';
      const BookingConfirmationDate = op.booking_confirmation_date
        ? new Date(op.booking_confirmation_date).toLocaleDateString()
        : '-';
      const ETDDate = op.etd_date
        ? new Date(op.etd_date).toLocaleDateString()
        : '-';
      const ATDDate = op.atd_date
        ? new Date(op.atd_date).toLocaleDateString()
        : '-';
      const ETArequestedDate = op.eta_requested_date
        ? new Date(op.eta_requested_date).toLocaleDateString()
        : '-';
      const ATAdate = op.ata_date
        ? new Date(op.ata_date).toLocaleDateString()
        : '-';
      const PortEntryDate = op.port_entry_date
        ? new Date(op.port_entry_date).toLocaleDateString()
        : '-';
      const Status = op.status;

      const objeto = {
        Item,
        ProdutoId,
        Descricao,
        Quantidade,
        PlantaId,
        GRRequested,
        GRActual,
        BookingConfirmationDate,
        ETDDate,
        ATDDate,
        ETArequestedDate,
        ATAdate,
        PortEntryDate,
        Status,
      };
      arrayExcel.push(objeto);
    });

    const csvData = arrayExcel;

    return (
      <div className="center">
        <div className="page-header">
          <h1>
            <img src={iconOperacional} alt="" />
            Operacional
          </h1>
          <div className="last-wrap">
            <CSVLink
              data={csvData}
              separator=";"
              filename="webcol-operacional.xlsx"
            >
              <ExportExcel />
            </CSVLink>
            <div
              className={`btn-filter-nfs ${filtroAtivo ? 'active' : ''}`}
              onClick={this.btnFilter}
            >
              <div className="icon-filter">
                <span />
                <span />
                <span />
              </div>
              Filtrar
            </div>
          </div>
        </div>
        <p className="totalope">
          Total: <strong>{!isLoading && totalItems}</strong>
        </p>

        <div className={`filter-box ${filtroAtivo ? 'active' : ''}`}>
          <form className="formoperacional" onSubmit={this.handleFormSubmit}>
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
                          checked={dow}
                          id="sts-booking"
                          onChange={e => this.handleCheckboxGeral(e, 'dow')}
                        />
                        Dow
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="dupont"
                          checked={dupont}
                          id="sts-booking"
                          onChange={e => this.handleCheckboxGeral(e, 'dupont')}
                        />
                        Dupont
                      </label>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div className="item">
                    <label>Em andamento:</label>
                    <div className="boxstatus jcfs">
                      <label>
                        <input
                          type="checkbox"
                          name="Atrasados"
                          id="sts-booking"
                          checked={atrasados}
                          onChange={e =>
                            this.handleCheckboxGeral(e, 'atrasados')
                          }
                        />
                        Atrasados
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="noPrazo"
                          checked={noPrazo}
                          id="sts-booking"
                          onChange={e => this.handleCheckboxGeral(e, 'noPrazo')}
                        />
                        No prazo
                      </label>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={2}>
                  <div className="item">
                    <label>Critico:</label>
                    <div className="boxstatus jcfs">
                      <label>
                        <input
                          type="checkbox"
                          name="criticos"
                          id="sts-booking"
                          checked={criticos}
                          onChange={e =>
                            this.handleCheckboxGeral(e, 'criticos')
                          }
                        />
                        Sim
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG Booking"
                          id="sts-booking"
                          checked={naoCriticos}
                          onChange={e =>
                            this.handleCheckboxGeral(e, 'naoCriticos')
                          }
                        />
                        Não
                      </label>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="item">
                    <label>POs arquivadas:</label>
                    <div className="boxstatus jcfs">
                      <label>
                        <input
                          type="checkbox"
                          name="todos"
                          id="sts-booking"
                          checked={todos}
                          onChange={e => this.handleCheckboxGeral(e, 'todos')}
                        />
                        Liberar
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="item">
                    <label>Status:</label>
                    <div className="boxstatus">
                      <label>
                        <input
                          type="checkbox"
                          name="AG Booking"
                          id="sts-booking"
                          checked={!!statusTimeLine.includes('AG Booking')}
                          onChange={this.handleCheckboxStatus}
                        />
                        Booking
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. ATD"
                          id="sts-atd"
                          checked={!!statusTimeLine.includes('AG. ATD')}
                          onChange={this.handleCheckboxStatus}
                        />
                        ATD
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. ATA"
                          id="sts-ata"
                          checked={!!statusTimeLine.includes('AG. ATA')}
                          onChange={this.handleCheckboxStatus}
                        />
                        ATA
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. PORTY ENTRY"
                          id="sts-porty-entry"
                          checked={!!statusTimeLine.includes('AG. PORTY ENTRY')}
                          onChange={this.handleCheckboxStatus}
                        />
                        Porty Entry
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. DI"
                          id="sts-registro-di"
                          checked={!!statusTimeLine.includes('AG. DI')}
                          onChange={this.handleCheckboxStatus}
                        />
                        Registro DI
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. NF"
                          id="sts-ag-nf"
                          checked={!!statusTimeLine.includes('AG. NF')}
                          onChange={this.handleCheckboxStatus}
                        />
                        AG. NF
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="EM TRÂNSITO"
                          id="sts-loading-terminal"
                          checked={!!statusTimeLine.includes('EM TRÂNSITO')}
                          onChange={this.handleCheckboxStatus}
                        />
                        Loading Terminal
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. CHEGADA PLANTA"
                          id="sts-planta"
                          checked={
                            !!statusTimeLine.includes('AG. CHEGADA PLANTA')
                          }
                          onChange={this.handleCheckboxStatus}
                        />
                        Planta
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="AG. GR"
                          id="sts-gr-efetivo"
                          checked={!!statusTimeLine.includes('AG. GR')}
                          onChange={this.handleCheckboxStatus}
                        />
                        GR Efetivo
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={3}>
                  <div className="item">
                    <label>PO:</label>
                    <input
                      type="text"
                      id="idproduto"
                      value={po}
                      onChange={e => this.handleTextInput(e, 'po')}
                      autoComplete="false"
                    />
                  </div>
                </Col>
                <Col xs={12} md={1}>
                  <div className="item">
                    <label>PO item:</label>
                    <input
                      type="text"
                      id="idproduto"
                      value={item}
                      onChange={e => this.handleTextInput(e, 'item')}
                      autoComplete="false"
                    />
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="item">
                    <label>Produto:</label>
                    <input
                      type="text"
                      id="idproduto"
                      value={produto}
                      onChange={e => this.handleTextInput(e, 'produto')}
                    />
                  </div>
                </Col>
                <Col xs={12} md={2}>
                  <div className="item">
                    <label>Analista:</label>
                    <input
                      type="text"
                      id="idproduto"
                      value={analista}
                      onChange={e => this.handleTextInput(e, 'analista')}
                    />
                  </div>
                </Col>
                <Col xs={12} md={2}>
                  <div className="item">
                    <label>Planta Destino:</label>
                    <input
                      type="text"
                      id="idproduto"
                      value={plantaDestino}
                      onChange={e => this.handleTextInput(e, 'plantaDestino')}
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={3}>
                  <div className="item">
                    <label>ATA:</label>
                    <span>
                      <DatePicker
                        locale="pt-BR"
                        selected={ataDateIncio}
                        selectsStart
                        startDate={ataDateIncio}
                        endDate={ataDateFim}
                        onChange={e => this.handleDatePicker(e, 'ataDateIncio')}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="De"
                      />

                      <DatePicker
                        locale="pt-BR"
                        selected={ataDateFim}
                        selectsEnd
                        startDate={ataDateIncio}
                        endDate={ataDateFim}
                        onChange={e => this.handleDatePicker(e, 'ataDateFim')}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Até"
                      />
                    </span>
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div className="item">
                    <label>GR Programado:</label>
                    <span>
                      <DatePicker
                        locale="pt-BR"
                        selected={grProgramado}
                        selectsStart
                        onChange={e => this.handleDatePicker(e, 'grProgramado')}
                        startDate={grProgramado}
                        endDate={grProgramadoFim}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="De"
                      />
                      <DatePicker
                        locale="pt-BR"
                        selected={grProgramadoFim}
                        selectsEnd
                        onChange={e =>
                          this.handleDatePicker(e, 'grProgramadoFim')
                        }
                        startDate={grProgramado}
                        endDate={grProgramadoFim}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Até"
                      />
                    </span>
                  </div>
                </Col>
                <Col xs={12} md={3}>
                  <div className="item">
                    <label>GR Efetivo:</label>
                    <span>
                      <DatePicker
                        locale="pt-BR"
                        selected={grEfetivo}
                        selectsEnd
                        onChange={e => this.handleDatePicker(e, 'grEfetivo')}
                        startDate={grEfetivo}
                        endDate={grEfetivoFim}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="De"
                      />
                      <DatePicker
                        locale="pt-BR"
                        selected={grEfetivoFim}
                        selectsEnd
                        onChange={e => this.handleDatePicker(e, 'grEfetivoFim')}
                        startDate={grEfetivo}
                        endDate={grEfetivoFim}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Até"
                      />
                    </span>
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
                <Col xs={12} md={1}>
                  <div className="item">
                    <label> &nbsp; </label>
                    <button
                      type="button"
                      className="btn cancel removepadding"
                      onClick={this.clearFilter}
                    >
                      Limpar
                    </button>
                  </div>
                </Col>
              </Row>
            </Grid>
          </form>
        </div>

        <div className="list-ope">
          <header className="header-list-ope">
            <p className="critico" />
            <p className="po">PO</p>
            <p className="produto">Produto</p>
            <p className="descricao">Descrição</p>
            <p className="qtd">Qtd.</p>
            <p className="pd">P. Destino</p>
            <p className="ata">ATA</p>
            <p className="grp">GR Original</p>
            <p className="gre">GR Atual</p>
            <p className="status">Status</p>
          </header>

          {isLoading ? (
            <Loading />
          ) : (
            operacional.map(ope => (
              <div
                onClick={() => {
                  history.push(`operacional/detalhe/${ope.uuid}`);
                }}
                className={` ${ope.alert ? 'item yes' : 'item'} ${
                  ope.channel === 'Red' ? 'red' : ''
                } `}
                key={ope.uuid}
              >
                <span className="critico" />
                <p className="po">{`${ope.po.order_reference}-${ope.item}`}</p>
                <p className="produto">{ope.po.product.product_id}</p>
                <p className="descricao">
                  {ope.po.product.product_description}
                </p>
                <p className="qtd">{ope.qty}</p>
                <p className="pd">{ope.plant_id}</p>
                <p className="ata">
                  {ope.ata_date
                    ? new Date(ope.ata_date).toLocaleDateString()
                    : '-'}
                </p>
                <p className="grp">
                  {ope.gr_original
                    ? new Date(ope.gr_original).toLocaleDateString()
                    : '-'}
                </p>
                <p className="gre">
                  {ope.gr_actual
                    ? new Date(ope.gr_actual).toLocaleDateString()
                    : '-'}
                </p>
                <div className="status alert">
                  <img
                    onClick={e => {
                      e.stopPropagation();
                      !ope.user_po_items[0]
                        ? this.handleFavorite(ope.uuid)
                        : this.handleUnFavorite(ope.user_po_items[0].uuid);
                    }}
                    src={star}
                    className={`favorite ${ope.user_po_items[0] ? '' : 'not'}`}
                    not
                    alt="Favorito"
                  />
                  <p>{ope.status_time_line}</p>{' '}
                  {/* <div
                    onClick={this.openPopupbox}
                    className="icon-justificativa"
                  /> */}
                </div>
              </div>
            ))
          )}

          <Pagination
            page={page}
            onAfter={() => this.handleAfter}
            onBefore={() => this.handleBefore}
            onFirst={() => this.handleFirst}
            onLast={() => this.handleLast}
            totalPages={totalPages}
          />
        </div>
      </div>
    );
  }
}

export default Operacional;
