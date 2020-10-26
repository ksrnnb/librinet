import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { routingList } from './RoutingList';

export const PropsContext = React.createContext();

export function MainColumn() {
  return (
    <div id="main-column">
      <Switch>
        {routingList.map((MyRoute) => {
          const isExact = MyRoute.isExact ? MyRoute.isExact : false;
          const attr = MyRoute.attr ? MyRoute.attr : {};

          return (
            <Route
              exact={isExact}
              path={MyRoute.path}
              key={MyRoute.path}
              render={(props) => (
                <PropsContext.Provider value={props}>
                  <MyRoute.component {...attr} />
                </PropsContext.Provider>
              )}
            />
          );
        })}
      </Switch>
    </div>
  );
}
