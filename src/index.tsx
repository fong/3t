import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ReactAI from 'react-appinsights';
import createHistory from 'history/createBrowserHistory';
import {AppInsights} from "applicationinsights-js"
// import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';

const history = createHistory();
ReactAI.init({instrumentationKey:'dd6e96b9-8f1a-4895-bdaa-0bbeb0c41a85'}, history);
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
if (AppInsights.downloadAndSetup !== undefined) {
  AppInsights.downloadAndSetup({ instrumentationKey: "dd6e96b9-8f1a-4895-bdaa-0bbeb0c41a85" });
}
