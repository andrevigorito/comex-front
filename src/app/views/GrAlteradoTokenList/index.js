import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import swal from '@sweetalert/with-react';
import Loading from '../components/Loading';

import api from '../../services/api';

import { UserList, BtnCadastrar } from './styles';

export default function TransitTimeList(props) {
  const [transitTimeList, setTransiTimeList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    async function loadTrasitTime() {
      setIsLoading(true);
      const userToken = props.match.params.userToken;
      const response = await api.post(`users/${userToken}/grAlterados`);
      setTransiTimeList(response.data.rows);
      setIsLoading(false);
    }

    loadTrasitTime();
  }, []);

  return (
    <div>
      <div className="center">
        <div className="page-header">
          <h1>ALERTAS DE GR ALTERADO</h1>
          <div className="last-wrap">
            {/*
            <Link to="/novo/transit/">
              <BtnCadastrar>Adicionar Transit Time</BtnCadastrar>
            </Link>
            */}
          </div>
        </div>
        <div>
          <UserList>
            <div className="header">
              {/* <p>Nome</p> */}
              <p>PO</p>
              <p>PRODUTO</p>
              <p>MENSAGEM</p>
            </div>

            {!isLoading ? transitTimeList.map(object => (
              <div className="item" key={object.uuid}>
                <p>{object.po_item.po.order_reference+'-'+object.po_item.item}</p>
                <p>{object.po_item.po.product.product_description}</p>
                <p>{object.message}</p>
                {/*
                
                <p>{transitTime.destination}</p>
                <p>{transitTime.transit}</p>
                */}
          
              </div>
            )) : <Loading/>}
          </UserList>
        </div>
      </div>
    </div>
  );
}
