import React, { Component } from 'react'
import Phone from './phone.png';
import axios from 'axios'
import qs from 'qs';
import  { Link, Redirect }  from "react-router-dom";
import NavbarComponent from './NavbarComponent';

export class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            fieldRequired: false,
            samePassword: false,
            wrongRegister: false,
            emailRegistered: false,
            LoggedIn: false,
            loading: false,
        };
    }
    
    onSubmit = (e) => {
        e.preventDefault()
            this.setState({loading: true})
            const data = {
                name: this.state.name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
            }
            
            if  (this.state.name === '' || this.state.last_name === '' || this.state.email === '' || this.state.password === '' || this.state.confirm_password === ''){
                this.setState({fieldRequired: true})
                this.setState({loading: false})
            }else if ( this.state.password !== this.state.confirm_password) {
                this.setState({samePassword: true})
                this.setState({loading: false})
            }
            else {
                axios.post('http://localhost:4000/api/register', qs.stringify(data), {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .then( async res => {
                    await this.setState({registerSuccesfully: true})
                    await this.setState({name: '', last_name: '', email: '', password: '', confirm_password: ''});
                    await localStorage.setItem('token', res.data.token);
                    await this.setState({LoggedIn: true}) })
                .catch( error => {
                    if (error.request.status === 404) {
                        this.setState({emailRegistered: true})
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
                        <div className=" d-none d-sm-none d-md-none  d-lg-block col-lg-6">
                            <img  src={Phone} className="img-fluid mt-2" alt=""/>
                        </div>

                        <div className="col-12 col-sm-12 col-md-8 col-lg-6">
                             {this.state.wrongRegister && 
                                <div className="alert alert-warning mt-3 col-11 col-sm-11 col-md-6 col-lg-6" role="alert">
                                    Some thing wrong, try again!
                                </div>
                            }
                            <div  className="card mt-3 mt-sm-3 mt-md-3 mt-lg-5">
                                <div className="card-header text-center">
                                    <h3>Sign Up</h3>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.name}
                                                type="text" name="name"
                                                placeholder="Name"
                                                className="form-control" />
                                        </div>
                                            
                                        <div className="form-group">
                                            <input  onChange={this.onChange}
                                                value={this.state.last_name}
                                                type="text" name="last_name"
                                                placeholder="Last name"
                                                className="form-control" />
                                        </div>
                                            
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.email}
                                                type="email" name="email"
                                                placeholder="Email"
                                                className="form-control" />
                                        </div> 
                                        {this.state.emailRegistered && <div className="form-group">
                                            <p className="text-danger">The email was registered</p>
                                         </div> } 
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.password}
                                                type="password" name="password"
                                                placeholder="Password"
                                                className="form-control" />
                                        </div>
                                            
                                        <div className="form-group">
                                            <input onChange={this.onChange}
                                                value={this.state.confirm_password}
                                                type="password" name="confirm_password"
                                                placeholder="Confirm Password"
                                                className="form-control" />
                                        </div>
                                        {this.state.samePassword && <div className="form-group">
                                            <p className="text-danger">The password no match</p>
                                         </div> }
                                        {this.state.fieldRequired && <div className="form-group">
                                            <p className="text-danger">All field are required</p>
                                         </div> }
                                        {this.state.loading ? 
                                        <button className="disable form-control btn btn-dark">Sending...</button>
                                        : <button type="submit" className="form-control btn btn-dark">Sign Up</button>}     
                                    </form>
                                </div>
                                <div className="card-footer text-center">
                                    <Link className="link" to="/login">Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default RegisterComponent
