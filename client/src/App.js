import React from 'react';
import './App.css';

class App extends React.PureComponent {
  state = {
    image: {},
    url: null,
    description: [],
    loading: false,
    q: ''
  }
  callEndPoint = (e) => {
    // e.preventDefault()
    this.setState({ loading: true })
    let form = new FormData(this.refs.myForm);
    form.append('theImage', this.state.image);
    fetch('http://localhost:5000/upload',{
      method: 'POST',
      body: form
    })
    .then(res=>{
      return res.json()
    })
    .then((result)=>{
      console.log(result)
      this.setState({
        url: result.message,
        description: result.description,
        loading: false
      })
    })
    .catch((err)=>{
      this.setState({ loading: false })
      console.log(err)
    })
  }

  onChange = (e) => {
    e.preventDefault()
    this.setState({ q: e.target.value })
  }

  searchEndPoint = () => {
    fetch('http://localhost:5000/search',{
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        q: this.state.q
      }
    })
    .then(res=>{
      return res.json()
    })
    .then((result)=>{
      console.log(result)
    })
    .catch((err)=>{
      this.setState({ loading: false })
      console.log(err)
    })
  }

  saveImage = (event) => {
    let image = event.target.files[0];
    this.setState({ image })
  }
  render(){
  return (
    <div className="container ">
      <h1>File Upload</h1>
        <form 
        ref="myForm"
        encType="multipart/form-data"></form>
          <div className="file-field input-field">
            <div className="btn grey">
              <span>File</span>
              <input type="file" onChange={this.saveImage} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button 
          onClick={this.callEndPoint}
          className="btn"
          >Submit</button>

          {
            (this.state.loading) &&
            <div className="position">
                <div className="preloader-wrapper big active">
                  <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                      <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                      <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                      <div className="circle"></div>
                    </div>
                  </div>
                </div>
              </div>
          }
          <div>
          {
            (this.state.url) &&
            <img src={this.state.url} alt="Uploaded" />
          }
          {
            (this.state.description.length > 0) && 
            this.state.description.map((val)=>{
              return (
                <span><ul>{val}</ul></span>
              )
            })
          }

          </div>
          <div className="input-field col s6">
            <input id="reverse_search" type="text" className="validate" onChange={this.onChange} />
            <label htmlFor="reverse_search">Reverse Search</label>
          </div>
          <button 
          onClick={this.searchEndPoint}
          className="btn"
          >SEARCH</button>
    </div>
  );
  }
}

export default App;
