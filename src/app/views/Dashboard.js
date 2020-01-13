/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
// Images
import iconTitleDash from '../img/icons/title-dash.png';

// Components
const Tab = ({ children }) => {
  const { isActive, onClick } = useTabState();
  return (
    <button className={isActive && 'active'} onClick={onClick}>
      {children}
    </button>
  );
};

const Panel = ({ children }) => {
  const isActive = usePanelState();
  return isActive ? <p>{children}</p> : null;
};

class Dashboard extends PureComponent {
  render() {
    return (
      <div>
        <div className="center">
          <Tabs>
            <div className="navgerencial">
              <Tab>Performance de GR</Tab>
              <Tab>Antecipação / Alteração de GR</Tab>
            </div>
            <div className="page-header">
              <h1>
                <img src={iconTitleDash} alt="" />
                Dashboard
              </h1>
            </div>
            <Panel>
              <iframe
                width="100%"
                height="700"
                src="https://app.powerbi.com/view?r=eyJrIjoiY2VjMGI4ZjgtMWZjYi00MzMwLWIzYTctM2MyODllNDI1YmU1IiwidCI6IjNhNTZkODhlLWUxNjgtNGNmZC1hMWM4LWVlOTVlMzVkZGI5ZiJ9"
                frameBorder="0"
                allowFullScreen="true"
                title="Dashboard1"
              />
            </Panel>
            <Panel>
              <iframe
                width="100%"
                height="700"
                src="https://app.powerbi.com/view?r=eyJrIjoiN2NmM2JhMTctZmIyZC00YjdmLWJhNzMtYjU2NGM2ZDY0ZjE4IiwidCI6IjNhNTZkODhlLWUxNjgtNGNmZC1hMWM4LWVlOTVlMzVkZGI5ZiJ9"
                frameBorder="0"
                allowFullScreen="true"
                title="Dashboard2"
              />
            </Panel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Dashboard;
