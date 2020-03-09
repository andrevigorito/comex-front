import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';

import api from '../../services/api';

import logo from '../../img/logo.png'

import * as S from './styles';

export default function TransitTimeList(props) {
  const [transitTimeList, setTransiTimeList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    async function loadTrasitTime() {
      setIsLoading(true);
      const { userToken } = props.match.params;
      const response = await api.post(`users/${userToken}/grAlterados`);
      setTransiTimeList(response.data.rows);
      setIsLoading(false);
      console.log(response.data)
    }

    loadTrasitTime();
  }, []);

  return (
    <>
      <S.Header>
        <img src={logo} alt="" title="WebCOL" />
      </S.Header>
      <S.Title>Alertas de GR Alterado</S.Title>
      <S.UserList>
        {!transitTimeList.tokenInvalido ? (
          <>
            <div className="header">
              <p>PO</p>
              <p>PRODUTO</p>
              <p>MENSAGEM</p>
            </div>

            {!isLoading ? (
              transitTimeList.map(object => (
                <div className="item" key={object.uuid}>
                  <p>
                    {`${object.po_item.po.order_reference}-${object.po_item.item}`}
                  </p>
                  <p>{object.po_item.po.product.product_description}</p>
                  <p>{object.message}</p>
                </div>
              ))
            ) : (
              <Loading />
            )}
          </>
        ) : (
          <S.Erro>Token invalido.</S.Erro>
        )}
      </S.UserList>
    </>
  );
}
