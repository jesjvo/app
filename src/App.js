import React from 'react';
import { HashRouter,Route,Link,Routes,Navigate } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

// Pages
import Files from './Files.js'
import Editor from './Editor.js'
import CreateFile from './CreateFile.js';
import './App.css';

// Icons
import { AiFillFile } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillFolder } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiMiniPaintBrush } from "react-icons/hi2";

const ipcRenderer = window.require("electron").ipcRenderer;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      theme: 'light',
      isOpen: false,
      shouldRedirect: false
    }
  }

  componentDidMount(){
    ipcRenderer.send('check-folders', null)
  }

  onChange(){
    if(this.state.theme=='dark'){
      this.setState({theme:'light'})}
      else{this.setState({theme:'dark'})}
  }

  render(){
    return(
      <HashRouter>
        <div className="frame">
          <CreateFile open={this.state.isOpen} onClose={()=> this.setState({isOpen: false})}  onSubmit={()=> this.setState({isOpen: false, shouldRedirect: true})} theme={this.state.theme}/>
          <div className="frame-container" id={this.state.theme}>
            <div className="header">
              <div className='header-items'>
                <Link to={'/'} onClick={()=>this.setState({shouldRedirect:false})} draggable='false' id={this.state.theme}>
                  <button className='header-button' ><AiFillFile size={20} /></button>
                </Link>

                <Link to={'/Editor'} draggable='false' id={this.state.theme}>
                  <button className='header-button'><AiFillEdit size={20}/></button>
                </Link>
                <button className='header-button' onClick={()=>this.setState({isOpen:true})}><AiFillPlusCircle size={19}/></button>
              </div>

              <div className='header-window' id={this.state.theme}>  
                <button className='header-button' onClick={()=>this.onChange()}><HiMiniPaintBrush size={19}/></button>
                <button className='header-button' onClick={()=>ipcRenderer.send('open-folder', null)}><AiFillFolder size={19}/></button>
                <button className='header-button' onClick={()=>ipcRenderer.send("close-window")}><AiFillCloseCircle size={19}/></button>

              </div>
            </div>
            <div className="content" id={this.state.theme}>
                    {this.state.shouldRedirect ? (
                    <Navigate replace to="/Editor"/>
                      ) : null}
                      <Routes>
                          <Route
                              def path="/" element={<Files theme={this.state.theme}/>}/>
                          <Route
                          index path="/Editor" element={<Editor theme={this.state.theme}/>}/>
                      </Routes>
              </div>
          </div>
        </div>
        </HashRouter>
    )
  }
}

export default App;

reportWebVitals();
