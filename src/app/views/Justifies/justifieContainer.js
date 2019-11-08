import React, { Component, Fragment } from 'react';
import * as API from '../../helpers/apiHelper';

// Components
import JustifieForm from './justifieForm';
import JustifieList from './justifieList';

// Components
class justifieContainer extends Component {
  state = {
    modalJust: false,
    modalAddJust: true,
    isLoading: true,
    justifies: null,
    typesJustifies: {},
    checkedJustifies: [],
  };

  async componentDidMount() {
    this.getJustifies(this.props.uuid);
    this.getTypesJustifies();
  }

  async getJustifies(uuid) {
    this.setState({ isLoading: true });
    const response = await API.APIget(`justifies/${uuid}`);

    if (response) this.setState({ justifies: response.data });

    this.setState({ isLoading: false });
  }

  async getTypesJustifies() {
    const response = await API.APIget(`typesJustification`);

    if (response) this.setState({ typesJustifies: response.data });

    this.setState({ isLoading: false });
  }

  handleJustifieDelete = async uuid => {
    await API.APIdelete(`justifies/${uuid}`);
    this.getJustifies(this.props.uuid);
  };

  handleJustifieCreation = async justifie => {
    try {
      await API.APIpost(
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
      );

      this.getJustifies(this.props.uuid);

      this.setState({ modalJust: true, modalAddJust: false });
    } catch (err) {
      alert(err);
    }
  };

  handlePoItemWarrant = async () => {
    if (this.state.checkedJustifies.length > 0) {
      try {
        await API.APIpost(
          'poItems/warrant',
          {
            uuid: this.props.uuid,
            justifies: this.state.checkedJustifies,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        await this.props.getPoItem();

        this.setState({ modalJust: true, modalAddJust: false });
      } catch (err) {
        alert(err);
      }
    } else {
      alert('Nenhuma justificativa selecionada!');
    }
  };

  handleJustifieChecked = async (checked, uuid) => {
    if (checked) {
      await this.setState(prevState => ({
        checkedJustifies: [...prevState.checkedJustifies, { uuid }],
      }));
      console.log(this.state.checkedJustifies);
    } else {
      delete this.state.checkedJustifies[uuid];
      console.log(this.state.checkedJustifies);
    }
  };

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
          ) : null}
        </div>
        <div className="wrap-btns">
          {!deop.warranted ? (
            <Fragment>
              <button
                type="button"
                className="btn abonar"
                onClick={() => this.handlePoItemWarrant()}
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
          ) : null}

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
