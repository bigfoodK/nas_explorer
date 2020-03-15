import React from 'react';
import Plugins from '../../plugins';
import { RouteProps, BrowserRouter, Route, Switch } from 'react-router-dom';
import { PluginProps, PluginStates } from './pluginInterfaces';
import './Plugin.css';

export default class plugin extends React.Component<PluginProps & RouteProps, PluginStates> {
  constructor(props: PluginProps & RouteProps) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <div className="plugin">
          <Switch>
            <Route path='/explore/plugin' exact render={(props) => (
              <div>
                {
                  Plugins.map(plugin => {
                    return (
                      <div
                        className='icon-container'
                        key={ plugin.info.name + plugin.info.version }
                      >
                        <plugin.IconComponent/ >
                      </div>
                    );
                  })
                }
              </div>
            )} />
            {
              Plugins.map(plugin => {
                return (
                  <Route path={ `/explore/plugin/${plugin.info.name}/` } render={(props) => (
                    <plugin.MainComponent {...props} />
                  )} />
                );
              })
            }
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
