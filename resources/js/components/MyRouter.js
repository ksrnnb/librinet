import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { DataContext } from '../views/App';
import { routingList } from './RoutingList';
import SubColumn from './SubColumn';

export const PropsContext = React.createContext();

export function MyRouter() {
  const data = useContext(DataContext);
  const url = data.params.user && '/user/profile/' + data.params.user.str_id;

  return (
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
                {props.location.pathname === '/' ? (
                  <MyRoute.component {...attr} />
                ) : (
                  <div id="column-wrapper" className="container">
                    <SubColumn userUrl={url} />
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
