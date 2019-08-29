import React, { Component, Fragment } from 'react';
import API from '../../services/api';

// Components
import JustifieForm from './justifieForm';
import JustifieList from './justifieList';

// Components
class justifieContainer extends Component {
  state = {
    modalJust: false,
    modalAddJust: true,
    isLoading: true,
    isLoadingTypes: true,
    justifies: null,
    typesJustifies: {},
    checkedJustifies: [],
  };

  async componentDidMount() {
    this.getJustifies(this.props.uuid);
    this.getTypesJustifies();
  }

  async getJustifies(uuid) {
    this.setState({
      isLoading: true,
    });
    API.get(`justifies/${uuid}`).then(res => {
      const justifies = res.data;
      this.setState({
        justifies,
        isLoading: false,
      });
    });
  }
  
  async getTypesJustifies(uuid) {
    this.setState({
      isLoadingTypes: true,
    });
    API.get(`typesJustification`).then(res => {
      const typesJustifies = res.data;
      this.setState({
        typesJustifies,
        isLoadingTypes: false,
      });
    });
  }

  handleJustifieDelete = async uuid => {
    API.delete(`justifies/${uuid}`).then(res => {
      this.getJustifies(this.props.uuid);
    });
  };

  handleJustifieCreation = async justifie => {
    try {
      const rawResponse = await API.post(
        'justifies',
        {
          description: justifie.description,
          type: justifie.type,
          email: justifie.email,
          poItemUuid: this.props.uuid,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ).catch(error => {
        throw error;
      });

      const content = await rawResponse;

      this.getJustifies(this.props.uuid);

      this.setState({ modalJust: true, modalAddJust: false });
    } catch (err) {
      alert(err);
    }
  };
  
  handlePoItemWarrant = async () => {
    try {
      const rawResponse = await API.post(
        'poItems/warrant',
        {
          uuid: this.props.uuid,
          justifies: this.state.checkedJustifies,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      ).catch(error => {
        throw error;
      });

      const content = await rawResponse;
      
      this.props.getPoItem()

      this.setState({ modalJust: true, modalAddJust: false });
    } catch (err) {
      alert(err);
    }
  };
  
  handleJustifieChecked = async (checked,uuid) => {
      if(checked){
        await this.setState(prevState => ({
              checkedJustifies: [...prevState.checkedJustifies,{uuid}]
          })
        )
        console.log(this.state.checkedJustifies)
      }else{
        delete this.state.checkedJustifies[uuid]
        console.log(this.state.checkedJustifies)
      }
  }

  render() {
    const { deop } = this.props;
    return (
      <div className="lb-justificativa">
        <div className="content">
          <h2>Justificativas {deop.warranted && 'Abonadas'}</h2>
          {this.state.modalAddJust && !deop.warranted && (
            <JustifieForm 
              onJustifieCreation={this.handleJustifieCreation} 
              typesJustifies={this.state.typesJustifies}  
            />
          )}

          {this.state.modalJust || deop.warranted ? (
            <JustifieList
              isLoading={this.state.isLoading}
              onJustifieDelete={this.handleJustifieDelete}
              onJustifieChecked={this.handleJustifieChecked}
              warranted={deop.warranted}
              justifies={this.state.justifies}
            />
          ):null}
        </div>
        <div className="wrap-btns">
          {!deop.warranted ?
            <Fragment>
              <button 
                type="button" 
                className="btn abonar"
                onClick={() =>
                  this.handlePoItemWarrant()
                }
              >
                Abonar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  this.setState({ modalJust: false, modalAddJust: true })
                }
              >
                Adicionar
              </button>
            </Fragment>  
            : null
          }
          
          <button
            type="button"
            className="btn"
            onClick={() =>
              this.setState({ modalJust: true, modalAddJust: false })
            }
          >
            Justificativas
          </button>
        </div>
      </div>
    );
  }
}

export default justifieContainer;
