import React from 'react';

//icons
import { AiFillPlusCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";

/*window requirements */
  const ipcRenderer = window.require("electron").ipcRenderer;
  const fs = window.require("fs");
  const os = window.require("os");
  const path = window.require('path');

  const sep = path.sep;
  const folderName = "jes's editor"
  const folder = os.homedir() + sep + folderName + sep
  const filesFolder = folder + sep + 'Files' + sep

function File(props){
  const deleteFile = (filePath) => {
    console.log("deleted " + filePath)
    //needs to delete file...
    //then refresh front-end list...
  }

  const openFile = (filePath) => {
    console.log("open file " + filePath)
    //needs to open the file, get its contents, send it to the editor ->
    //then editor opens through route, sets the contents that were sent...
  }

  return(
      <div className='box-container' id={props.theme}>
        <div className='left-container' id={props.theme} onClick={()=> {openFile(props.filePath)}}>
          <p style={{fontSize:'20px', margin:'5px'}}>{props.fileName}</p>
          <p style={{fontSize:'12px', margin:'0 0 0 5px', opacity:'.75'}}>{props.filePath}</p>
          <p style={{fontSize:'12px', margin:'0 0 0 5px', opacity:'.75'}}>Last Opened : {props.fileDate}</p>
        </div>
          <div className='right-container' id={props.theme}>
              <button className='trash-container'><FaTrash size={30} onClick={()=> {deleteFile(props.filePath)}}/></button>
          </div>
      </div>
  )
}

var key = 0;
var Id = 0;
class Files extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      file : [],
  }
}

updateFrontEnd(){
  ipcRenderer.send('check-folders', null)
  let state = [{}]
  
  fs.readdir(filesFolder, (err, files) => {
    files.forEach(f => {
      state.push({...state,
        name:f,
        path: folder+f,
        date: (new Date().getHours() +" : "+ new Date().getMinutes())
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

addFile(){
  ipcRenderer.send('check-folders', null)

  let pathId; let dateId; let nameId; 

  nameId=(key++).toString()
  pathId=filesFolder + nameId
  dateId=new Date().getFullYear()

  fs.writeFile(filesFolder + nameId, (''), (err) =>{
      if(!err) {
        this.updateFrontEnd()
      }else{
        ipcRenderer.send('error', err)
      }
    }
  );
}
  
  render(){
    return(
        <div className='container' id={this.props.theme}>
          <div className='files-container'>
          <div className='add-container' id={this.props.theme}>
              <button className='add-button' onClick={this.addFile.bind(this)}><AiFillPlusCircle size={30}/></button>
          </div>
            {this.state.file.map((file, index) => {
              return (
                <div key={index}>
                  <File fileName={file.name} filePath={file.path} fileDate={file.date} fileId={file.id}></File>
                </div>
                )
            })}
          </div>
        </div>
    )
  }
}
  
export default Files;