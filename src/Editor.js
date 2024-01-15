import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const fs = window.require("fs");
const os = window.require("os");
const path = window.require('path');

const sep = path.sep;
const folderName = "Jes's Editor" + sep;
const homeDir = os.homedir() + sep

const folder = homeDir + folderName
const autoSaveFolder = folder + 'AutoSave' + sep
const activeFile = autoSaveFolder + 'activeFile'

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.quillRef = React.createRef(null)
    this.state = {
      writingFile: fs.readFileSync(activeFile, 'utf8')
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

      if(fs.existsSync(this.state.writingFile)){
        var content = JSON.parse(fs.readFileSync(this.state.writingFile, 'utf8'))

        editor.root.dataset.placeholder = ('You are writing in "' + this.state.writingFile.split(sep).pop() +'".');
      }
      else{
        var content = ''
        this.setState({writingFile: null})
        editor.root.dataset.placeholder = ("No file is selected, this won't save.");
      }
      editor.setContents(content)
    }
  }

  onChange(content, delta, source, editor) {
    if(fs.existsSync(this.state.writingFile)){
      fs.writeFile(this.state.writingFile, JSON.stringify(editor.getContents()), (err) =>{
        if(!err) {}
        else{}
      });
    }
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