import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

//icons
import { FaTrash } from "react-icons/fa6";

/*window requirements */
  const ipcRenderer = window.require("electron").ipcRenderer;

  const fs = window.require("fs");
  const os = window.require("os");
  const path = window.require('path');

  const sep = path.sep; const extension = '.json'
  const folderName = "Jes's Editor" + sep;
  const homeDir = os.homedir() + sep
  
  const folder = homeDir + folderName
  const filesFolder = folder + 'Files' + sep
  const autoSaveFolder = folder + 'AutoSave' + sep
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
        if(path.extname(f)=='.json')
          state.push({...state,
            name:path.parse(f).name,
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
    let filePath = filesFolder + fileName + extension
    fs.writeFile(activeFile, filePath, (err) =>{
      if(!err) {
        this.setState({ shouldRedirect: true })
      }else{}
    }
  );
  }

  deleteFile(fileName){
    fs.unlink(filesFolder + fileName + extension, (err) => {
        if (err) {} else {
          this.updateFrontEnd()
        }
      });
  }
    
    render(){
      return(
          <div className='container' id={this.props.theme}>
            <div className='files-container'>
              {this.state.file.map((file, index) => {
                return (
                  <div key={index}>
                    {this.state.shouldRedirect ? (
                    <Navigate replace to="/Editor" />
                      ) : null}
                      <div className='box-container' id={this.props.theme}>
                        <div className='left-container' id={this.props.theme} onClick={()=> {this.openFile(file.name)}}>
                          <p style={{fontSize:'18px', margin:'5px'}}>{file.name}</p>
                          <p style={{fontSize:'12px', margin:'0 0 0 5px', opacity:'.75'}}>{file.path}</p>
                        </div>
                          <div className='right-container' onClick={()=> {this.deleteFile(file.name)}} id={this.props.theme}>
                              <button className='trash-container'><FaTrash size={30}/></button>
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