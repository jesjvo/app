import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ipcRenderer = window.require("electron").ipcRenderer;
const fs = window.require("fs");
const os = window.require("os");
const path = window.require('path');

class Editor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      quillRef: React.createRef(null),
      content: null
    }
  }

  componentDidMount(){
    if(this.state.quillRef!=null){
      console.log(this.props.theme)
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

  onChange(content, delta, source, editor) {
    console.log(editor.getContents())
    this.setState({content : (editor.getContents())}) //{array}{:} format (mainly used)

    ipcRenderer.send("set-current-content", editor.getContents())
  }
  
  render(){
    return(
      <div className='container'>
        <div className='row'>
          <div className='editor'>
            <ReactQuill
            id={this.props.theme}
            ref={this.state.quillRef}
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