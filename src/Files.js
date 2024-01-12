import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

//icons
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillFolder } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";

/*window requirements */
  const ipcRenderer = window.require("electron").ipcRenderer;
  const fs = window.require("fs");
  const os = window.require("os");
  const path = window.require('path');

  const sep = path.sep; const extension = '.json'
  const folderName = "jes's editor" + sep; const homeDir = os.homedir() + sep
  const folder = homeDir + folderName
  const filesFolder = folder + 'Files' + sep
  const autoSaveFolder = folder + 'AutoSave' + sep
  
  const autoSaveFile = autoSaveFolder + 'Content' + extension
  const activeFile = autoSaveFolder + 'activeFile'
  
  const quickFileName = 'Files' + sep
  

class Files extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        shouldRedirect: false,
        file : [],
    }
  }


  updateFrontEnd(){
    let state = [{}]
    
    fs.readdir(filesFolder, (err, files) => {
      files.forEach(f => {
        state.push({...state,
          name:f,
          path: quickFileName +f,
        })
      } 
        )
        state.shift()
        this.setState({file:state})
      }
    )
  }

  componentDidMount(){
    this.updateFrontEnd()
  }

  openFile(fileName){
    let filePath = filesFolder + fileName
    fs.writeFile(activeFile, filePath, (err) =>{
      if(!err) {
        this.setState({ shouldRedirect: true })
      }else{
        ipcRenderer.send('error', err)
      }
    }
  );
  }

  addNewFile(){
    let date = new Date()
    var name = date.getHours() + date.getMinutes() + date.getSeconds()
    var fileName = filesFolder + name + extension

    if(!fs.existsSync(fileName)){
      fs.writeFile(filesFolder + name + extension, JSON.stringify(''), (err) =>{
        if(!err) {
          this.updateFrontEnd()
        }else{
          ipcRenderer.send('error', err)
        }
      }
    );
  }else{
    ipcRenderer.send("error", "already exists")
  }
  }

  deleteFile(fileName){
    fs.unlink(filesFolder + fileName, (err) => {
        if (err) {
          console.error(err);
        } else {
          this.updateFrontEnd()
        }
      });
  }
    
    render(){
      return(
          <div className='container' id={this.props.theme}>
            <div className='files-container'>
            <div className='add-container' id={this.props.theme}>
              <button className='header-button' style={{height:'40px'}} onClick={this.addNewFile.bind(this)}><AiFillPlusCircle size={20}/></button>
              <button className='header-button' onClick={()=>{ipcRenderer.send('open-folder', null)}}><AiFillFolder size={19}/></button>
            </div>
              {this.state.file.map((file, index) => {
                return (
                  <div key={index}>
                    {this.state.shouldRedirect ? (
                    <Navigate replace to="/Editor" />
                      ) : null}
                      <div className='box-container' id={this.props.theme}>
                        <div className='left-container' id={this.props.theme} onClick={()=> {this.openFile(file.name)}}>
                          <p style={{fontSize:'20px', margin:'5px'}}>{file.name}</p>
                          <p style={{fontSize:'12px', margin:'0 0 0 5px', opacity:'.75'}}>{file.path}</p>
                        </div>
                          <div className='right-container' id={this.props.theme}>
                              <button className='trash-container'><FaTrash size={30} onClick={()=> {this.deleteFile(file.name)}}/></button>
                          </div>
                      </div>
                  </div>
                  )
              })}
            </div>
          </div>
      )
    }
}
  
export default Files;