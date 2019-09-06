import React, { Component } from 'react'
import axios from 'axios'
import qs from 'qs';
import  { Link, Redirect }  from "react-router-dom";
import NavbarComponent from './NavbarComponent';

export class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            fieldRequired: false,
            emailOrPaswordIncorrect: false,
            wrongRegister: false,
            LoggedIn: false,
        }
    }

    onSubmit = (e) => {
        e.preventDefault()
            this.setState({loading: true})
            const data = {
                email: this.state.email,
                password: this.state.password,
            }
            
            if  (this.state.email === '' || this.state.password === ''){
                this.setState({fieldRequired: true})
                this.setState({loading: false})
            }else {
                axios.post('http://localhost:4000/api/login', qs.stringify(data), {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .then( async res => {
                    await this.setState({email: '', password: ''});
                    await localStorage.setItem('token', res.data.token);
                    await this.setState({LoggedIn: true})
                })
                .catch( error => {
                    if (error.request.status === 404) {
                        this.setState({emailOrPaswordIncorrect: true})
                        this.setState({loading: false})
                    } else {
                        this.setState({wrongRegister: true})
                        this.setState({loading: false})
                    }
                })
            }
                 
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        if (this.state.LoggedIn) {
            return <Redirect to='/posts' />
        }
        return (
            <React.Fragment>
                <NavbarComponent />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-12 col-md-7 mt-5">
                            <div className="card">
                                <div className="card-header">
                                    Login
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.email}
                                                type="email" name="email"
                                                placeholder="Email"
                                                className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.password}
                                                type="password" name="password"
                                                placeholder="Password"
                                                className="form-control" />
                                        </div>
                                        {this.state.fieldRequired && 
                                            <div className="for-group">
                                                <p className="text-danger">Email y password are required</p>
                                            </div>
                                        }
                                        {this.state.emailOrPaswordIncorrect && 
                                            <div className="for-group">
                                                <p className="text-danger">Email or password incorrect</p>
                                            </div>
                                        }
                                        {this.state.loading ? 
                                        <button className="disable form-control btn btn-dark">Sending...</button>
                                        : <button type="submit" className="form-control btn btn-dark">Login</button>}
                                    </form>
                                </div>
                                <div className="card-footer text-center">
                                    <Link className="link" to="/">Sign Up</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LoginComponent
