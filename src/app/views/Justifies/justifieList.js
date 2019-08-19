import React, { Fragment } from 'react';
import Loading from '../components/Loading';

function JustifieList(props) {
  return (
    <Fragment>
      {!props.isLoading ? (
        props.justifies.map(justifie => (
          <div className="list-justificativas">
            <div className="item">
              <p>{justifie.description}</p>
              <button onClick={() => props.onJustifieDelete(justifie.uuid)}>
                Del
              </button>
              <div className="user">
                <p>{justifie.tye}</p>
                <p>{new Date(justifie.createdAt).toLocaleDateString()}</p>
                <p>{justifie.email}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}

export default JustifieList;
