import React, { Component } from 'react'
import  { Link, Redirect }  from "react-router-dom";


export default class NavbarComponent extends Component {

    constructor(props) {
        super(props);
        const token = localStorage.getItem('token')

        let loggedIn = true
        if (token === null) {
            loggedIn = false
        }

        this.state = {
            loggedIn
        }

    }

    Logout = () => {
        localStorage.removeItem('token');
          return <Redirect to='/login' />
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">MaGram</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item ">
                                    {this.state.loggedIn ? 
                                    <Link onClick={this.Logout} to="/login" className="nav-link" >logout</Link> :
                                    <Link className="nav-link" to="/login">Login</Link>
                                    }
                                    
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </React.Fragment>
        )
    }
}
