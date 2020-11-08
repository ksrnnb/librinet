import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routingList } from './RoutingList';
import SubColumn from './SubColumn';
import { RouterProps } from '../types/Interfaces';

export const PropsContext = React.createContext({} as RouterProps);

export function MyRouter() {
  return (
    <Switch>
      {routingList.map((MyRoute: any) => {
        const isExact = MyRoute.isExact ? MyRoute.isExact : false;
        const attr = MyRoute.attr ? MyRoute.attr : {};

        return (
          <Route
            exact={isExact}
            path={MyRoute.path}
            key={MyRoute.path}
            render={(props) => (
              <PropsContext.Provider value={props}>
                {props.location.pathname === '/' ? (
                  <MyRoute.component {...attr} />
                ) : (
                  <div id="column-wrapper" className="container">
                    <SubColumn />
                    <div id="main-column">
                      <MyRoute.component {...attr} />
                    </div>
                  </div>
                )}
              </PropsContext.Provider>
            )}
          />
        );
      })}
    </Switch>
  );
}
