import React, { PureComponent } from 'react';
// Images
import iconTitleDash from '../img/icons/title-dash.png';

// Components

class Dashboard extends PureComponent {
  render() {
    return (
      <div>
        <div className="center">
          <div className="page-header">
            <h1>
              <img src={iconTitleDash} alt="" />
              Dashboard
            </h1>
          </div>

          <iframe
            width="100%"
            height="700"
            src="https://app.powerbi.com/view?r=eyJrIjoiY2VjMGI4ZjgtMWZjYi00MzMwLWIzYTctM2MyODllNDI1YmU1IiwidCI6IjNhNTZkODhlLWUxNjgtNGNmZC1hMWM4LWVlOTVlMzVkZGI5ZiJ9"
            frameBorder="0"
            allowFullScreen="true"
            title="Dashboard"
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
