import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ipcRenderer = window.require("electron").ipcRenderer;
const fs = window.require("fs");
const os = window.require("os");
const path = window.require('path');

const sep = path.sep;
const folderName = "jes's editor"
const folder = os.homedir() + sep + folderName + sep
const autoSaveFolder = folder + 'AutoSave' + sep
const autoSaveFile = autoSaveFolder + 'Content.JSON'

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.quillRef = React.createRef(null)
    this.state = {
      content: null
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
    ipcRenderer.send('check-folders', null)
    if(this.quillRef){
      var content = JSON.parse(fs.readFileSync(autoSaveFile, 'utf8'))
      var editor = this.quillRef.current.getEditor()
      editor.setContents(content)
    }
  }

  onChange(content, delta, source, editor) {
    this.setState({content : (content)})
    ipcRenderer.send("update-content", editor.getContents()) //{array}{:} format (mainly used)
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
            placeholder='Write something here'
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