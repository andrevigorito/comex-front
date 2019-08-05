/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

class Pagination extends Component {
  
  
  
  render() {
    
    const { onBefore, onAfter, page } = this.props;
    
    return (
      <div className="pagination">
        <div className="arrow prev" onClick={onBefore()} >Anterior</div>
        {page > 1 && <div className="arrow" onClick={onBefore()}>{page-1}</div>}
        <div className="arrow">{page}</div>
        <div className="arrow" onClick={onAfter()}>{page+1}</div>
        <div className="arrow next" onClick={onAfter()} >Próxima</div>
      </div>
    );
    
  }
}

export default Pagination;