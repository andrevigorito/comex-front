import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import swal from 'sweetalert';
import { UserList, BtnCadastrar } from './styles';
import api from '../../../services/api';

export default function ListTipoJustificativa() {
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    async function loadTiposJustificativa() {
      const response = await api.get(`/typesJustification`);
      setTipos(response.data);
    }

    loadTiposJustificativa();
  }, []);

  async function removerTransitTime(uuid) {
    const confirmDelete = await swal({
      dangerMode: true,
      text: 'Confirma a exclusão do tipo de justificativa?',
      buttons: {
        cancel: 'Não',
        confirm: 'Sim',
      },
    });

    if (confirmDelete) {
      await api.delete(`/typesJustification/${uuid}`);

      const response = await api.get(`/typesJustification`);
      setTipos(response.data);
    }
  }

  return (
    <div>
      <div className="center">
        <div className="page-header">
          <h1>Tipo de Justificativa</h1>
          <div className="last-wrap">
            <Link to="/tipoJustificativa/novo">
              <BtnCadastrar>Adicionar Tipo de Justificativa</BtnCadastrar>
            </Link>
          </div>
        </div>
        <div>
          <UserList>
            <div className="header">
              {/* <p>Nome</p> */}
              <p>Nome</p>
              <p>Data Criação</p>
              <p>Alterar</p>
            </div>

            {tipos.map(tipo => (
              <div className="item" key={tipo.uuid}>
                <p>{tipo.name}</p>
                <p>{new Date(tipo.createdAt).toLocaleString()}</p>
                <Link to={`/tipoJustificativa/${tipo.uuid}`}>
                  <button type="button" className="btn">
                    Alterar
                  </button>
                </Link>
                <p>
                  <button
                    type="button"
                    className="btn excluir"
                    onClick={() => removerTransitTime(tipo.uuid)}
                  >
                    Excluir
                  </button>
                </p>
              </div>
            ))}
          </UserList>
        </div>
      </div>
    </div>
  );
}
