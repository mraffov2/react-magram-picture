import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";


import RegisterComponent from './components/RegisterComponent';
import PostsComponent from './components/PostsComponent'
import LoginComponent from './components/LoginComponent'

function App() {
  return (
    <React.Fragment>
      <Router>
          
          <Route exact path="/" component={RegisterComponent} />
          <Route path="/posts" component={PostsComponent} />
          <Route path="/login" component={LoginComponent} />
      </Router>
    </React.Fragment>
  );
}

export default App;
