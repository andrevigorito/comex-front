import React, { Component, Fragment } from 'react'
import XLSX from 'xlsx';
import io from 'socket.io-client';
import API from '../service/api';
import { FilePicker } from 'react-file-picker'
import { toast } from 'react-toastify';

// Images
import iconTitleDash from '../img/icons/title-dash.png'

//Components
import Loading from './components/Loading';
import DragAndDrop from './components/DragAndDrop'

const socket = io('https://webcol.herokuapp.com');

class Import extends Component {
    
    state = {
		isConverting: false,
		isSending: false,
		isWaiting: false,
	}
	
	componentDidMount(){
	    this.registerToSocket();
	}
	
	componentWillUnmount(){
		this.unregisterToSocket();
	}

	handleImportAtl = async (file) => {
        this.setState({ isConverting: true});
        var workbook = await this.getWorkbookFromFile(file[0] ? file[0] : file);
        var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var data = await XLSX.utils.sheet_to_json(first_worksheet, {header:0});
        this.setState({ isConverting: false });
        this.sendImportATL(data);
	}
	
	sendImportATL(data){
	    this.setState({ isSending: true});
	    API.post(`products`, 
	            data, 
    	       {headers: {'Content-Type': 'application/json'}}
	         )
	        .then(res => {
	            this.setState({ isSending: false, isWaiting: true });
			    this.notifyWarn("IMPORTAÇÃO ATL ENVIADA! AGUARDANDO CONCLUSÃO!");
			}
        )
	}
    
    async getWorkbookFromFile(excelFile) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = (event) => {
                var data = event.target.result;
                var workbook = XLSX.read(data, { type: 'binary' , cellDates: true });
                resolve(workbook);
            };
            reader.readAsBinaryString(excelFile);
        });
    } 
    
    registerToSocket = () => {
        socket.on('productsImport', () => {
        		this.setState({ isWaiting: false });
        		this.notifySucess("IMPORTAÇÃO ATL CONCLUÍDA!");
	    	}
        )
    }
    
    unregisterToSocket = () => {
        socket.removeListener('productsImport');
    }
    
	notifySucess = (msg) => {
		toast.success(msg, {
		  position: toast.POSITION.BOTTOM_RIGHT
		});
	};
	
	notifyWarn = (msg) => {
		toast.warn(msg, {
		  position: toast.POSITION.BOTTOM_RIGHT
		});
	};
	
	notifyError = (msg) => {
		toast.error(msg, {
		  position: toast.POSITION.BOTTOM_RIGHT
		});
	};
	
    render(){
        return(
			<div>
								
				<div className="center">
                    <div className="page-header">
                        <h1>
                            <img src={iconTitleDash} alt="" />
                            Import
                        </h1>
                    </div>
                    <center>
				    {this.state.isConverting ?
				        <Fragment>
				            <Loading />
				            <h2>CONVERTENDO PLANILHA EXCEL...</h2>
				        </Fragment> 
				        : this.state.isSending ?
				        <Fragment>
				            <Loading />
				            <h2>ENVIANDO DADOS PARA O SERVIDOR...</h2>
				        </Fragment> 
				        : this.state.isWaiting ?
				        <Fragment>
				            <Loading />
				            <h2>ENVIADO COM SUCESSO! AGUARDANDO RESPOSTA DO SERVIDOR...</h2>
				        </Fragment> 
				        :
				        <Fragment>
				            <FilePicker
                                extensions={['xlsx','xls']}
                                onChange={fileObject => this.handleImportAtl(fileObject)}
                                onError={errMsg => this.notifyError("O arquivo não é uma planilha excel!")}
                            >
                                <button>
                                    SELECIONE A PLANILHA ATL
                                </button>
                            </FilePicker>
    				        <DragAndDrop handleDrop={this.handleImportAtl}>
                                <div style={{height: 300, width: 800, backgroundColor: 'white'}}>
                                  OU ARRASTE A PLANILHA PARA ESTE LOCAL
                                </div>
                            </DragAndDrop>
        				</Fragment>    
				    }
				    </center>
				</div>
			</div>
		)
    }
}

export default Import;