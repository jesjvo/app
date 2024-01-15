import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import {Routes, Route, Navigate} from 'react-router-dom';
import './App.css';

//icons
import { IoArrowBackCircle } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";

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

export default function CreateFile({open, onClose, onSubmit, theme}) {
  const [fileName, setFileName] = useState("");
  
  if(!open) return null

  const handleSubmit = (event) => {
    event.preventDefault();
    var filePath = filesFolder + fileName + extension

    if(fileName.length<1){
      return
    }
    if(!fs.existsSync(filePath)){
      for (let i = 0; i < fileName.length; i++) {
        var f=fileName.split('')[i]
        if(("[^\\/:\x22*?<>|]+").includes(f)){
          return
        }
      }
      fs.writeFile(filePath, JSON.stringify(''), (err) =>{
        if(!err) {
          fs.writeFile(activeFile, filePath, (err) =>{
            if(!err) {onSubmit()} 
          }
        )
        }else{}
      }
    );

  }else{
    return
    }
  }

  return (
    
    <div id={theme} className='createfile-container'>
    <div className='background-container' />
    <div className='modal-container' >
        <div className='top-modal-container'>
              <input
              className='input-container'
              type="text" 
              placeholder='Untitled'
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              maxLength={25}
              />
        </div>
        <div className='bottom-modal-container'>
        <button onClick={onClose} style={{width:'50%', height:'100%'}}><IoArrowBackCircle size={'5vh'}/></button>
        <button onClick={handleSubmit} style={{width:'50%', height:'100%'}}><IoIosCheckmarkCircle size={'5vh'}/></button>
        </div>
    </div>
    </div>
  )
}
