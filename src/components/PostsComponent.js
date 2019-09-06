import React, { Component } from 'react'
import  {  Redirect }  from "react-router-dom";
import axios from 'axios'
import NavbarComponent from './NavbarComponent';
import noPhoto from './no-image-icon.png'



export class PostsComponent extends Component {
    
    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
        this.buttonPost = React.createRef();
        this.form = React.createRef();
        const token = localStorage.getItem('token')

        let loggedIn = true
        if (token === null) {
            loggedIn = false
        }

        this.state = {
            loggedIn,
            posts: [],
            loading: true,
            file: null,
            fileSeledted: '' | ArrayBuffer,
            noImage: false,
            invalidExtName: false,
            postSuccesfully: false,
            loadinPicture: false,
        }

    }

    inputCLick = () => {
        this.fileInput.current.click()
    } 

    onChangeFile = (e) =>{
        this.setState({file: null})
        if (e.target.value) {
            let nameFile = e.target.files[0].name
            let arrayName = nameFile.split(".")
            if (arrayName[1] === 'jpg' || arrayName[1] === 'jpeg' || arrayName[1] === 'png') {
                this.setState({file: e.target.files[0]})
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.setState({fileSeledted: reader.result})
                };

                reader.readAsDataURL(e.target.files[0]);
                this.setState({invalidExtName: false})
                
                
            } else {
                this.setState({invalidExtName: true})
            }
        }
        
        
    }

    getPosts= async () => {
        const token = localStorage.getItem('token')
        await axios.get('https://appexpressjwt.herokuapp.com/api/posts',{
            headers: {'x-access-token': token}
        })
            .then( async (res)  => {
                // handle success
                const data = await res.data;
                this.setState({posts: data});
                this.setState({loading: false})
            })
            .catch(function (error) {
                console.log(error.request);
                if(error.resquest.status === 403 || error.request.status === 500){
                    localStorage.removeItem('token');
                    this.setState({loggedIn: false})
                }
        })
    }

    onSubmit= async (e) => {
        e.preventDefault()
        this.setState({loadinPicture: true})
        if (this.state.file === null) {
            this.setState({noImage: true})
            this.setState({loadinPicture: false})
        }else{
            const token = localStorage.getItem('token')
            const formData = new FormData();
            formData.append('image', this.state.file)
            await axios.post('https://appexpressjwt.herokuapp.com/api/post', formData, {
                headers: {'x-access-token': token,
                'content-type': 'multipart/form-data'}
            })
                .then( res  => {
                    this.setState({ postSuccesfully: true })
                    this.componentDidMount()
                    this.buttonPost.current.click() 
                    this.setState({loadinPicture: false})
                })
                .catch( error => {
                    console.log(error.request);
                    if(error.resquest.status === 403 || error.request.status === 500){
                        localStorage.removeItem('token');
                        this.setState({loggedIn: false})
                    }
            })}
        
    }
    
    componentDidMount() {
        if (this.state.loggedIn) {
            this.getPosts()
        } 
    }

    

    renderRedirect = () => {
        if (!this.state.loggedIn) {
          return <Redirect to='/login' />
        }
    }

    closeMessage = () => {
        this.setState({postSuccesfully: false})
    }


    render() {
        
        return ( 
            <React.Fragment>
                <NavbarComponent />
                {this.renderRedirect()}
                <div className="container">
                    {this.state.postSuccesfully && 
                        <div className="row justify-content-center">
                            <div onClick={this.closeMessage} className="alert alert-success alert-dismissible fade show mt-3 col-12 col-sm-12 col-md-8" role="alert">
                                <strong>The post picture</strong> was succesfully!.
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                    }
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-12 col-md-9 col-lg-8">
                            <p className="mt-3">
                                <a ref={this.buttonPost} className="btn btn-primary bg-dark" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                    Add posts
                                </a>
                            </p>
                            <div className="collapse" id="collapseExample">
                                <div className="card card-body">
                                    <form onSubmit={this.onSubmit} ref={this.form}>
                                        <div className="form-group">
                                        <input name="file" type="file" className="d-none" ref={this.fileInput} onChange={this.onChangeFile} />
                                        <img onClick={this.inputCLick} src={this.state.fileSeledted || noPhoto} className="img-fluid" alt=""/>
                                        </div>
                                        {this.state.invalidExtName && <div className="form-group">
                                            <p className="text-danger">Valid ext: jpg, jpeg and png</p>
                                        </div>}
                                        {this.noImage && <div className="form-group">
                                            <p className="text-danger">The picture is required</p>
                                        </div>}
                                        <div className="form-group">
                                        {this.state.loadinPicture ? 
                                            <button type="submit" className="disable form-control btn btn-dark ">Sending...</button>
                                            :<button type="submit" className="form-control btn btn-dark">Add picture</button>
                                        }
                                        
                                        </div>
                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.loading ? <div className="row justify-content-center">
                        <div className="mt-4">
                            <div className="spinner-border text-dark" role="status">
                                <span className="sr-only text-center">Loading...</span>
                            </div>
                        </div>
                    </div>: 
                        <div className="row justify-content-center">
                            { this.state.posts.length !== 0 ?
                                this.state.posts.map(post => {
                                    return <div key={post._id} className="col-12 col-sm-12 col-md-9 col-lg-8">
                                        <div  className="card mt-3">
                                            <div key={post.id} className="card-header">
                                                {post.user.name} {post.user.last_name}
                                            </div>
                                            <img src={"http://localhost:4000/uploads"+post.imageUrl} className="card-img-top img-fluid " alt="..."></img>
                                        </div>
                                    </div>
                                })
                            : <div className="col-12 col-sm-12 col-md-9 col-lg-8">
                                <h1 className="text center">No pictures yet, try doing a new posts</h1>
                            </div> }
                        </div>}   
                </div>
            </React.Fragment>
        )
    }
}

export default PostsComponent
