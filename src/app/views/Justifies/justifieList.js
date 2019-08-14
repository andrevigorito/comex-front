import React,  { useState, useEffect } from 'react';
import API from '../services/api';

function JustifieList() {
  const [justifies, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await API.get(
      'justifies',
    );

    setData(result.data);
  });

  return (
    <div className="list-justificativas">
      {justifies.hits.map(just => (
        <div className="item">
          <p>{just.description}</p>
          <div className="user">
            <p>{just.description}</p>
            <p>{just.createdAt}</p>
            <p>{just.tye}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JustifieList;
