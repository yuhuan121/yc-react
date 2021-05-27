import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/Login'
import Admin from './pages/Admin'



class App extends React.Component {
  
  render() {
    return(
      <div className="App">
        <Router>
          <Switch> 
            <Route path='/login' component={Login}></Route>
            <Route path='/' component={Admin}></Route>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
