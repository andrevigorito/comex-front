import React, { Fragment } from 'react';
import Loading from '../components/Loading';

function JustifieList(props) {
  return (
    <Fragment>
      {!props.isLoading ? (
        props.justifies.map(justifie => (
          !props.warranted || justifie.warranted?
          <div className="list-justificativas">
            <div className="item">
              <p>{justifie.description}</p>
              {!props.warranted &&
                <Fragment>
                  <input type="checkbox" onChange={(e) => props.onJustifieChecked(e.target.checked,justifie.uuid)} />
                  <button onClick={() => props.onJustifieDelete(justifie.uuid)}>
                    Del
                  </button>
                </Fragment>
              }
              <div className="user">
                <p>{justifie.tye}</p>
                <p>{new Date(justifie.createdAt).toLocaleDateString()}</p>
                <p>{justifie.email}</p>
              </div>
            </div>
          </div>
          : null
        ))
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}

export default JustifieList;
