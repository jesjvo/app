import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter,Route,Link,Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

// Pages
import Files from './Files.js'
import Editor from './Editor.js'
import './App.css';

// Icons
import { AiFillFile } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { HiMiniPaintBrush } from "react-icons/hi2";

const ipcRenderer = window.require("electron").ipcRenderer;
const fs = window.require("fs");
const os = window.require("os");
const path = window.require('path');

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      theme: 'dark'
    }
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
          <div className="frame-container" id={this.state.theme}>
            <div className="header">
              <div className='header-items'>
                <Link to={'/'} draggable='false' id={this.state.theme}>
                  <button className='header-button' ><AiFillFile size={19} /></button>
                </Link>

                <Link to={'/Editor'} draggable='false' id={this.state.theme}>
                  <button className='header-button'><AiFillEdit size={19}/></button>
                </Link>
              </div>

              <div className='header-window' id={this.state.theme}>  
                <button className='header-button' onClick={()=>this.onChange()}><HiMiniPaintBrush size={19}/></button>
                <button className='header-button' onClick={()=>ipcRenderer.send("close-window")}><AiFillCloseCircle size={19}/></button>
              </div>
            </div>
            <div className="content" id={this.state.theme}>
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
