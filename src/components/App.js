import React,{Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Admin from './Admin';
import AirDrops from './AirDrops';
// import OtherUsers from './OtherUsers';
// import Whitelist from './Whitelist';
// import Withdraw from './Withdraw';

class App extends Component { 

  render(){
    return (
      <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Admin} />
            <Route exact path='/airDrops' component={AirDrops} />
            {/* <Route exact path='/nonwhitelist' component={OtherUsers} />
            <Route exact path='/whitelist' component={Whitelist} />
            <Route exact path='/free' component={Free} />
            <Route exact path='/withdraw' component={Withdraw} /> */}
        </Switch>
      </BrowserRouter>
    );
  }

}

export default App;