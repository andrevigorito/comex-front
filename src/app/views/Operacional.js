import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { CSVLink } from 'react-csv';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

import { format } from 'date-fns';

import API from '../services/api';
import 'react-datepicker/dist/react-datepicker.css';

// Images
import iconOperacional from '../img/icons/title-ope.png';

// Components
import Loading from './components/Loading';
import Pagination from './components/Pagination';
import ExportExcel from './components/ExportExcel';

registerLocale('pt-BR', ptBR);
// import FilterOperacional from './components/FilterOperacional';

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
    po: '',
    produto: '',
    plantaDestino: '',
    status: [],
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
      status,
    } = this.state;

    const params = {
      page,
      po,
      produto,
      plantaDestino,
    };

    if (status.length !== 0) {
      params.status = JSON.stringify(status);
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
    const { data: operacional, total: totalPages } = response.data;

    this.setState({
      operacional,
      isLoading: false,
      totalPages,
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

  handleCheckbox = e => {
    const { status } = this.state;

    if (e.target.checked) {
      const statusExiste = status.find(s => s.status === e.target.name);

      if (!statusExiste) {
        const data = {
          status: e.target.name,
        };

        this.setState({ status: [...status, data] });
      }
    } else {
      const statusIndex = status.findIndex(s => s.status === e.target.name);

      status.splice(statusIndex, 1);
      this.setState({ status });
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
    console.log(csvData);

    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconOperacional} alt="" />
              Operacional
            </h1>
            <div className="last-wrap">
              <CSVLink data={csvData} filename="webcol-operacional.csv">
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

          <div className={`filter-box ${filtroAtivo ? 'active' : ''}`}>
            <form className="formoperacional" onSubmit={this.handleFormSubit}>
              <Grid>
                <Row>
                  <Col xs={12} md={2}>
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
                  <Col xs={12} md={2}>
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
                      <label>Planta Destino:</label>
                      <input
                        type="text"
                        id="idproduto"
                        onChange={this.handlePlantaDestino}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="item">
                      <label>Status:</label>
                      <div className="boxstatus">
                        <label>
                          <input
                            type="checkbox"
                            name="NO PRAZO"
                            id="sts-dentrodoprazo"
                            onChange={this.handleCheckbox}
                          />
                          Dentro do prazo
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="ATRASADO"
                            id="sts-foradoprazo"
                            onChange={this.handleCheckbox}
                          />
                          Fora do Prazo
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="ABERTA"
                            id="sts-emaberto"
                            onChange={this.handleCheckbox}
                          />
                          Em Aberto
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="SEM PRAZO"
                            id="sts-ematraso"
                            onChange={this.handleCheckbox}
                          />
                          Sem Prazo
                        </label>
                      </div>
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
              <p className="critico">Crit.</p>
              <p className="po">PO</p>
              <p className="produto">Produto</p>
              <p className="descricao">Descrição</p>
              <p className="qtd">Qtd.</p>
              <p className="pd">P. Destino</p>
              <p className="ata">ATA</p>
              <p className="grp">GR Prog.</p>
              <p className="gre">GR Atual</p>
              <p className="status">Status / Just.</p>
            </header>

            {isLoading ? (
              <Loading />
            ) : (
              operacional.map(ope => (
                <Link to={`operacional/detalhe/${ope.uuid}`} key={ope.uuid}>
                  <div className="item" key={ope.uuid}>
                    <span className="critico" />
                    <p className="po">{ope.po.order_reference}</p>
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
                      {ope.gr_requested_date
                        ? new Date(ope.gr_requested_date).toLocaleDateString()
                        : '-'}
                    </p>
                    <p className="gre">
                      {ope.gr_actual
                        ? new Date(ope.gr_actual).toLocaleDateString()
                        : '-'}
                    </p>
                    <div className="status alert">
                      <p>{ope.status}</p>{' '}
                      {/* <div
                      onClick={this.openPopupbox}
                      className="icon-justificativa"
                    /> */}
                    </div>
                  </div>
                </Link>
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
      </div>
    );
  }
}

export default Operacional;
