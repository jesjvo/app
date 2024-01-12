import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.quillRef = React.createRef(null)
    this.state = {
      content: null,
      writingFile: ''
    }
  }

  modules = {
    history: {
      delay: 1000,
      maxStack: 500,
      userOnly: true
    },
    toolbar: [
      ['bold', "italic"],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }], 
      [{list: "ordered"}, {list: "bullet"}],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ align: '' }, { align: 'center' }],
    ]}
  
  componentDidMount(){
    if(this.quillRef){
      var editor = this.quillRef.current.getEditor()
      var setWritingFile = fs.readFileSync(activeFile, 'utf8') //reads active file

      if(fs.existsSync(setWritingFile)){ //if activated file exists
        var content = JSON.parse(fs.readFileSync(setWritingFile, 'utf8'))

        this.setState({writingFile: setWritingFile}); editor.setContents(content);
        editor.root.dataset.placeholder = ('You are writing in "' + setWritingFile.split(sep).pop() +'"');
      }else{
        var content = JSON.parse(fs.readFileSync(autoSaveFile, 'utf8'))
        editor.setContents(content)
        this.setState({writingFile: autoSaveFile})
        editor.root.dataset.placeholder = ('You are writing in NO file');
      }
    }
  }

  onChange(content, delta, source, editor) {
    this.setState({content : (content)})
    fs.writeFile(this.state.writingFile, JSON.stringify(editor.getContents()), (err) =>{
      if(!err) {console.log("File Written"); }
      else{
          console.log(err);
      }
  }); //{array}{:} format (mainly used)
  }
  
  render(){
    return(
      <div className='container'>
        <div className='row'>
          <div className='editor'>
            <ReactQuill
            id={this.props.theme}
            ref={this.quillRef}
            theme='snow'
            onChange={this.onChange.bind(this)}
            className='editor-input'
            modules={this.modules}/>
          </div>
      </div>
    </div>
    )
  }
}

export default Editor;