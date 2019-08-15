import React from 'react';
import Loading from '../components/Loading';

function JustifieList(props) {
  return (
    <>
      <div className="list-justificativas">
        {!props.isLoading ? (
          props.justifies.map(justifie => (
            <div className="item" key={justifie.uuid}>
              <p>{justifie.description}</p>

              <div className="user">
                <p>{justifie.tye}</p>
                <p>{new Date(justifie.createdAt).toLocaleDateString()}</p>
                <p>{justifie.email}</p>
                <button
                  className="btn excluir"
                  onClick={() => props.onJustifieDelete(justifie.uuid)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}

export default JustifieList;
