import React from 'react';
import Loading from '../components/Loading';

function JustifieList(props) {
  return (
    <>
      {!props.isLoading ? (
        props.justifies.map(justifie =>
          !props.warranted || justifie.warranted ? (
            <div className="list-justificativas">
              <div className="item">
                <p>{justifie.description}</p>
                  <div className="user">
                    {!props.warranted && (
                      <input
                        type="checkbox"
                        onChange={e =>
                          props.onJustifieChecked(e.target.checked, justifie.uuid)
                        }
                      />
                    )}
                    <p>{justifie.tye}</p>
                    <p>{new Date(justifie.createdAt).toLocaleDateString()}</p>
                    <p>{justifie.email}</p>
                  {!props.warranted && (
                    <button
                      className="btn excluir"
                      onClick={() => props.onJustifieDelete(justifie.uuid)}
                    >
                      Excluir
                    </button>

                  )}
                  </div>
              </div>
            </div>
          ) : null
        )
      ) : (
        <Loading />
      )}
    </>
  );
}

export default JustifieList;
