import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { CSVLink } from 'react-csv';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import history from '../services/history';
import { toast } from 'react-toastify';

import { format } from 'date-fns';

import API from '../services/api';
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

const favoriteUserUuid = 'aa27133b-8f3f-49c9-a912-b8ccfa9aa4c6';

class Operacional extends Component {
  state = {
    operacional: [],
    isLoading: false,
    filtroAtivo: false,
    ataDateIncio: '',
    ataDateFim: '',
    grProgramado: '',
    grProgramadoFim: '',
    grEfetivo: '',
    grEfetivoFim: '',
    page: 1,
    totalPages: 1,
    totalItems: 0,
    po: '',
    produto: '',
    plantaDestino: '',
    statusTimeLine: [],
    todos: false,
    atrasados: false,
    noPrazo: false,
    criticos: false,
    naoCriticos: false,
    dupont: false,
    dow: false,
    analista: '',
    item: '',
    
  };

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

  componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;

    if (page !== prevState.page) {
      this.getPoItems();
    }
    
  }
  
  handleFavorite = async (poItemUuid) => {
    if(this.props.useruuid === favoriteUserUuid){
      await this.setState({
        isLoading: true,
      });  
      await API.post(`userPoItems`, 
       {
         poItemUuid,
         userUuid: this.props.useruuid, 
       }, {
        headers: { 'Content-Type': 'application/json' },
      }).then(res => {
        this.getPoItems();
      })
    }else{
      this.notifyError("Você não tem permissão para executar esta função!")
    }
  }
  
  handleUnFavorite = async (favoriteUuid) => {
    if(this.props.useruuid === favoriteUserUuid){
      await this.setState({
        isLoading: true,
      }); 
      await API.delete(`userPoItems/${favoriteUuid}`)
      .then(res => {
          this.getPoItems();
        }
      )
    }else{
      this.notifyError("Você não tem permissão para executar esta função!")
    }  
  }
  
  notifyError = msg => {
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  componentDidMount() {
    this.getPoItems();
  }

  async getPoItems() {
    this.setState({ isLoading: true });

    const {
      po,
      page,
      produto,
      plantaDestino,
      ataDateIncio,
      ataDateFim,
      grProgramado,
      grProgramadoFim,
      grEfetivo,
      grEfetivoFim,
      statusTimeLine,
      todos,
      atrasados,
      noPrazo,
      criticos,
      naoCriticos,
      dupont,
      dow,
      analista,
      item,
    } = this.state;

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
      userUuid: this.props.userUuid,
    };

    if (statusTimeLine.length !== 0) {
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

    const response = await API.get(`poItems`, { params });
    console.log(response.data)
    
    const { data: operacional, total: totalPages, count: totalItems } = response.data;
    

    this.setState({
      operacional,
      isLoading: false,
      totalPages,
      totalItems,
    });
  }

  handleFormSubit = async e => {
    e.preventDefault();

    this.getPoItems();
  };

  btnFilter = () => {
    const { filtroAtivo } = this.state;
    this.setState({ filtroAtivo: !filtroAtivo });
  };

  handleQueryInput = e => {
    this.setState({ po: e.target.value });
  };

  handleProduto = e => {
    this.setState({ produto: e.target.value });
  };

  handlePlantaDestino = e => {
    this.setState({ plantaDestino: e.target.value });
  };

  handleAnalista = async e => {
    await this.setState({ analista: e.target.value });
  };

  handleItem = async e => {
    await this.setState({ item: e.target.value });
  };

  handleAtrasados = async e => {
    await this.setState({ atrasados: e.target.checked });
  };

  handleNoPrazo = async e => {
    await this.setState({ noPrazo: e.target.checked });
  };

  handleTodos = async e => {
    await this.setState({ todos: e.target.checked });
  };

  handleCriticos = async e => {
    await this.setState({ criticos: e.target.checked });
  };

  handleNaoCriticos = async e => {
    await this.setState({ naoCriticos: e.target.checked });
  };

  handleDow = async e => {
    await this.setState({ dow: e.target.checked });
  };

  handleDupont = async e => {
    await this.setState({ dupont: e.target.checked });
  };

  handleCheckbox = e => {
    const { statusTimeLine } = this.state;

    if (e.target.checked) {
      const statusTimeLineExiste = statusTimeLine.find(
        s => s === e.target.name
      );

      if (!statusTimeLineExiste) {
        // const data = [];

        this.setState({ statusTimeLine: [...statusTimeLine, e.target.name] });
      }
    } else {
      const statusTimeLineIndex = statusTimeLine.findIndex(
        s => s === e.target.name
      );

      statusTimeLine.splice(statusTimeLineIndex, 1);
      this.setState({ statusTimeLine });
    }
  };

  handleChangeDateAta = date => {
    this.setState({ ataDateIncio: date });
  };

  handleChangeDateAtaFim = date => {
    this.setState({ ataDateFim: date });
  };

  handleChangeGrProgramado = date => {
    this.setState({
      grProgramado: date,
    });
  };

  handleChangeGrProgramadoFim = date => {
    this.setState({
      grProgramadoFim: date,
    });
  };

  handleChangeGrEfetivo = date => {
    this.setState({
      grEfetivo: date,
    });
  };

  handleChangeGrEfetivoFim = date => {
    this.setState({
      grEfetivoFim: date,
    });
  };

  render() {
    const {
      isLoading,
      operacional,
      filtroAtivo,
      grEfetivo,
      grEfetivoFim,
      ataDateIncio,
      ataDateFim,
      grProgramado,
      grProgramadoFim,
      page,
      totalPages,
      totalItems,
    } = this.state;

    const arrayExcel = [];

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
    console.log(operacional);

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
                separator={';'}
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
          <p className="totalope">Total: <strong>{!isLoading && totalItems}</strong></p>

          <div className={`filter-box ${filtroAtivo ? 'active' : ''}`}>
            <form className="formoperacional" onSubmit={this.handleFormSubit}>
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
                            id="sts-booking"
                            onChange={this.handleDow}
                          />
                          Dow
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="dupont"
                            id="sts-booking"
                            onChange={this.handleDupont}
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
                            onChange={this.handleAtrasados}
                          />
                          Atrasados
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="noPrazo"
                            id="sts-booking"
                            onChange={this.handleNoPrazo}
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
                            onChange={this.handleCriticos}
                          />
                          Sim
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG Booking"
                            id="sts-booking"
                            onChange={this.handleNaoCriticos}
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
                            onChange={this.handleTodos}
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
                            onChange={this.handleCheckbox}
                          />
                          Booking
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. ATD"
                            id="sts-atd"
                            onChange={this.handleCheckbox}
                          />
                          ATD
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. ATA"
                            id="sts-ata"
                            onChange={this.handleCheckbox}
                          />
                          ATA
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. PORTY ENTRY"
                            id="sts-porty-entry"
                            onChange={this.handleCheckbox}
                          />
                          Porty Entry
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. DI"
                            id="sts-registro-di"
                            onChange={this.handleCheckbox}
                          />
                          Registro DI
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. NF"
                            id="sts-ag-nf"
                            onChange={this.handleCheckbox}
                          />
                          AG. NF
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="EM TRÂNSITO"
                            id="sts-loading-terminal"
                            onChange={this.handleCheckbox}
                          />
                          Loading Terminal
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. CHEGADA PLANTA"
                            id="sts-planta"
                            onChange={this.handleCheckbox}
                          />
                          Planta
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="AG. GR"
                            id="sts-gr-efetivo"
                            onChange={this.handleCheckbox}
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
                        onChange={this.handleQueryInput}
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
                        onChange={this.handleItem}
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
                        onChange={this.handleProduto}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={2}>
                    <div className="item">
                      <label>Analista:</label>
                      <input
                        type="text"
                        id="idproduto"
                        onChange={this.handleAnalista}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={2}>
                    <div className="item">
                      <label>Planta Destino:</label>
                      <input
                        type="text"
                        id="idproduto"
                        onChange={this.handlePlantaDestino}
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
                          onChange={this.handleChangeDateAta}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="De"
                        />

                        <DatePicker
                          locale="pt-BR"
                          selected={ataDateFim}
                          selectsEnd
                          startDate={ataDateIncio}
                          endDate={ataDateFim}
                          onChange={this.handleChangeDateAtaFim}
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
                          onChange={this.handleChangeGrProgramado}
                          startDate={grProgramado}
                          endDate={grProgramadoFim}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="De"
                        />
                        <DatePicker
                          locale="pt-BR"
                          selected={grProgramadoFim}
                          selectsEnd
                          onChange={this.handleChangeGrProgramadoFim}
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
                          onChange={this.handleChangeGrEfetivo}
                          startDate={grEfetivo}
                          endDate={grEfetivoFim}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="De"
                        />
                        <DatePicker
                          locale="pt-BR"
                          selected={grEfetivoFim}
                          selectsEnd
                          onChange={this.handleChangeGrEfetivoFim}
                          startDate={grEfetivo}
                          endDate={grEfetivoFim}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Até"
                        />
                      </span>
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

          <div className="list-ope">
            <header className="header-list-ope">
              <p className="critico"></p>
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
                    history.push(`operacional/detalhe/${ope.uuid}`)
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
                      onClick={(e) => {
                        e.stopPropagation();
                        !ope.user_po_items[0] ? this.handleFavorite(ope.uuid) : this.handleUnFavorite(ope.user_po_items[0].uuid);
                      }}
                      src={star} 
                      className={`favorite ${ope.user_po_items[0] ? '' : 'not'}`} 
                      not alt="Favorito" 
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
