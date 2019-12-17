import React from 'react';
import { Switch, Route } from 'react-router'
import './app.scss'
import indexRoutes from '../router/index'

class App extends React.Component {
 
  render() {
      return (
         <div>
           dddddddd
           <div>
              <Switch>
                {indexRoutes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.path}
                      component={prop.component}
                      key={key}
                    />
                  )
                })}
              </Switch>
           </div>
         </div>
      )
    }
}

export default App;