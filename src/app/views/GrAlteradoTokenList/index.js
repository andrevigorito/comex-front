import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';

import api from '../../services/api';

import logo from '../../img/logo.png';

import * as S from './styles';

export default function TransitTimeList(props) {
  const [transitTimeList, setTransiTimeList] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    async function loadTrasitTime() {
      setIsLoading(true);
      const { userToken } = props.match.params;

      await api.post(`users/${userToken}/grAlterados`).then(result => {
        setTransiTimeList(result.data);
        setIsLoading(false);
      });
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
        {!isLoading ? (
          <>
            {transitTimeList.tokenInvalido === false ? (
              <>
                <div className="header">
                  <p>PO</p>
                  <p>PRODUTO</p>
                  <p>MENSAGEM</p>
                </div>
                {transitTimeList.rows.map(object => (
                  <div className="item" key={object.uuid}>
                    <p>
                      {`${object.po_item.po.order_reference}-${object.po_item.item}`}
                    </p>
                    <p>{object.po_item.po.product.product_description}</p>
                    <p>
                      {`GR ATUAL ALTERADO DE: ${new Date(
                        object.po_item.gr_actual_old
                      ).toLocaleDateString()} PARA ${new Date(
                        object.po_item.gr_actual
                      ).toLocaleDateString()}.`}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <S.Erro>Token Inválido</S.Erro>
            )}
          </>
        ) : (
          <Loading />
        )}
      </S.UserList>
    </>
  );
}
