import React, { Component } from 'react';
import ProductContainer from './ProductContainer';
import AlteracaoGrContainer from './AlteracaoGr/AlteracaoGrContainer';

class PainelContainer extends Component {
  state = {
    gerencial: false,
    alteracaoGr: true,
  };

  handleGerencial = () => {
    this.setState({
      gerencial: true,
      alteracaoGr: false,
    });
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
          <button onClick={() =>  this.handleGerencial()}>
            Gerencial
          </button>
          <button onClick={() => this.handleAlteracaoGr()}>
            Alteração de GR
          </button>
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
