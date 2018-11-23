import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ReactAI from 'react-appinsights';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
ReactAI.init({instrumentationKey:'dd6e96b9-8f1a-4895-bdaa-0bbeb0c41a85'}, history);
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();