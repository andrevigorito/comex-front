import React, { Component, Fragment } from 'react';
import XLSX from 'xlsx';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import API from '../services/api';

// Images
import iconTitleDash from '../img/icons/title-dash.png';

// Components
import Loading from './components/Loading';
import DragAndDrop from './components/DragAndDrop';

const socket = io('https://webcol.herokuapp.com');

class Import extends Component {
  state = {
    isConverting: false,
    isSending: false,
    isWaiting: false,
    importType: "",
  };

  componentDidMount() {
    this.registerToSocket();
  }

  componentWillUnmount() {
    this.unregisterToSocket();
  }

  handleImportAtl = async file => {
    let name = file[0].name.split('.');
    if(name[1] === 'xlsx' || name[1] === 'xls' || name[1] === 'XLSX' || name[1] === 'XLS'){

      this.setState({ isConverting: true });
      const workbook = await this.getWorkbookFromFile(file[0]);
      const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let firstColumn = first_worksheet.A1 ? first_worksheet.A1.v : null;
      const data = await XLSX.utils.sheet_to_json(first_worksheet, { header: 0 });
      this.setState({ isConverting: false });
      
      if(firstColumn === "Group name"){
        this.setState({ importType: "PLANILHA ATL" });
        await this.sendImportATL(data);
      }else if (firstColumn === "Product Number"){
        this.setState({ importType: "PLANILHA SAP - DOW" }); 
        await this.sendImportSAPDow(data);
      }else if (firstColumn === "Opening Date"){
        this.setState({ importType: "PLANILHA SAP - DUPONT" });
        await this.sendImportSAPDupont(data);
      }else{
        this.notifyError('A PLANILHA EXCEL NÃO TEM UM FORMATO VÁLIDO!');
      }

    }else{
      this.notifyError('NÃO É UM ARQUIVO VÁLIDO!');
    }
  };

  sendImportATL(data) {
    
    this.setState({ isSending: true });
    API.post(`products`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      this.setState({ isSending: false, isWaiting: true });
      this.notifyWarn('IMPORTAÇÃO ATL ENVIADA! AGUARDANDO CONCLUSÃO!');
    });
  }
  
  sendImportSAPDow(data) {
    this.setState({ isSending: true });
    API.post(`products/importSapDow`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      this.setState({ isSending: false, isWaiting: true });
      this.notifyWarn('IMPORTAÇÃO SAP DOW ENVIADA! AGUARDANDO CONCLUSÃO!');
    });
  }
  
  sendImportSAPDupont(data) {
    this.setState({ isSending: true });
    API.post(`products/importSapDupont`, data, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      this.setState({ isSending: false, isWaiting: true });
      this.notifyWarn('IMPORTAÇÃO SAP DUPONT ENVIADA! AGUARDANDO CONCLUSÃO!');
    });
  }

  async getWorkbookFromFile(excelFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        resolve(workbook);
      };
      reader.readAsBinaryString(excelFile);
    });
  }

  registerToSocket = () => {
    socket.on('productsImport', () => {
      this.setState({ isWaiting: false });
    });
    socket.on('SapDowImport', () => {
      this.setState({ isWaiting: false });
    });
    socket.on('SapDupontImport', () => {
      this.setState({ isWaiting: false });
    });
  };

  unregisterToSocket = () => {
    socket.removeListener('productsImport');
    socket.removeListener('SapDowImport');
    socket.removeListener('SapDupontImport');
  };

  notifySucess = msg => {
    toast.success(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  notifyWarn = msg => {
    toast.warn(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  notifyError = msg => {
    toast.error(msg, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  render() {
    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconTitleDash} alt="" />
              Import
            </h1>
          </div>
          <div className='list-planilhas'>
            <div className='item'>Planilha ATL</div>
            <div className='item'>Planilha SAP DOW</div>
            <div className='item'>Planilha SAP DUPONT</div>
          </div>
          <center className='box-import'>
            {this.state.isConverting ? (
              <Fragment>
                <h2>{this.state.importType}</h2>
                <Loading />
                <h2>CONVERTENDO... {this.state.importType}</h2>
              </Fragment>
            ) : this.state.isSending ? (
              <Fragment>
                <h2>{this.state.importType}</h2>
                <Loading />
                <h2>{this.state.importType}... ENVIANDO DADOS PARA O SERVIDOR...</h2>
              </Fragment>
            ) : this.state.isWaiting ? (
              <Fragment>
                <h2>{this.state.importType}</h2>
                <Loading />
                <h2>{this.state.importType}... ENVIADA COM SUCESSO! AGUARDANDO RESPOSTA DO SERVIDOR... </h2>
              </Fragment>
            ) : (
              <Fragment>
                <input
                  type="file"
                  onChange={event => this.handleImportAtl(event.target.files)}
                />

                <DragAndDrop handleDrop={this.handleImportAtl}>
                  <div className='box-drop'>
                    <p>
                      Arraste a planilha para este local...
                    </p>
                  </div>
                </DragAndDrop>
              </Fragment>
            )}
          </center>
        </div>
      </div>
    );
  }
}

export default Import;
