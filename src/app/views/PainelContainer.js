/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import ProductContainer from './ProductContainer';
import AlteracaoGrContainer from './AlteracaoGr/AlteracaoGrContainer';

class PainelContainer extends Component {
  state = {
    gerencial: true,
    alteracaoGr: false,
  };

  handleGerencial = () => {
    this.setState({
      gerencial: true,
      alteracaoGr: false,
    });
  };

  handleAlteracaoGr = () => {
    this.setState({
      gerencial: false,
      alteracaoGr: true,
    });
  };

  render() {
    const { gerencial, alteracaoGr } = this.state;
    return (
      <div>
        <center>
          <div className="navgerencial">
            <button
              className={gerencial ? 'active' : ''}
              onClick={() => this.handleGerencial()}
            >
              Gerencial
            </button>
            <button
              className={alteracaoGr ? 'active' : ''}
              onClick={() => this.handleAlteracaoGr()}
            >
              Alteração de GR
            </button>
          </div>
        </center>
        <div>
          {gerencial && <ProductContainer />}
          {alteracaoGr && <AlteracaoGrContainer />}
        </div>
      </div>
    );
  }
}

export default PainelContainer;
