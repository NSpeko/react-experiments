import React, { Component } from 'react';
import {Tables} from './Tables';
import LineChart from 'react-linechart';
import randomColor from 'randomcolor';
import logo from '../assets/logo.svg';
import '../css/App.css';
import getContestData from '../utils/GameScore'
import chart from './Tables'

class App extends Component {

    constructor(props) {
      super(props);

      this.state = {
          session: 'real',
          results: getContestData()
      };

      this.onSessionChange = this.onSessionChange.bind(this);

    }

    onSessionChange() {
       this.setState((state) => ( {
            session : (state.session === 'real' ? 'test' : 'real')})
        );
       this.forceUpdate();
    }

    render() {
        let tempData=[];
        const data=[{id:"test", showLegends:true,color:randomColor(), points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: -3}]}];
        const table = (this.state.session === 'real' ? <Tables data={this.state.results[0]}/> : <Tables data={this.state.results[1]}/>)
        // setInterval(function () {
        //     console.log(globalChartData)
        // })
        return (
          <div className="App">
              <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
              </header>
              <p className="App-intro">
                  Ok, Pups is here
              </p>
              <div id="sessions">
                  <label htmlFor="real"><input id="real" onChange={this.onSessionChange} type="radio" name="group1" defaultChecked/>Real</label>
                  <label htmlFor="test"><input id="test" onChange={this.onSessionChange}  type="radio" name="group1"/>Test</label>
              </div>
              {table}
          </div>
      );
  }
}




export default App;
