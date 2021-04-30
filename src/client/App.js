import React, { Component } from 'react';
import './app.css';
import FileUpload from './fileupload';
import VideoPlayer from './videoplayer';
import { Dropdown, Button } from 'react-bootstrap';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import CheckBox from './checkbox';


export default class App extends Component {

  constructor() {
    super();
    this.state = {
      uploadedFiles: [],
      videoUrl: "",
      pythonOutput: "",
      isLoading: false
    };
  }

  componentDidMount() {
    this.getLocalFileNames();
  }

  getLocalFileNames() {
    axios.get('http://0.0.0.0:8080/api/getFileName', {
    }).then(res => {
      this.setState({
        uploadedFiles: res.data.allFilesName
      })
    }).catch(err => console.log(err))
  }

  handleDropdown(chosenFile) {
    this.setState((state) => {
      return { videoUrl: chosenFile }
    });
  }

  componentDidUpdate() {
    console.log(this.state.uploadedFiles)
  }

  processSelect() {

    let allFiles = this.state.uploadedFiles.filter(name => name.isChecked === true);
    let chosenFiles = []
    allFiles.map(({name,value})=> chosenFiles.push(name) )

    this.setState((state) => {
      return { isLoading: true }
    });
    axios.get('http://0.0.0.0:8080/api/processFile', {
      params: {
        fileName: chosenFiles
      }
    }).then(res => {
      this.setState({
        pythonOutput: res.data.mloutput,
        isLoading: false
      })
    }).catch(err => console.log(err))
  }

  handleAllChecked = (event) => {
    let uploadedFiles = this.state.uploadedFiles
    uploadedFiles.forEach(uploadedFile => uploadedFile.isChecked = event.target.checked)
    this.setState({ uploadedFiles: uploadedFiles })
  }

  handleCheckChieldElement = (event) => {
    let uploadedFiles = this.state.uploadedFiles
    uploadedFiles.forEach(uploadedFile => {
      if (uploadedFile.value === event.target.value)
        uploadedFile.isChecked = event.target.checked
    })
    this.setState({ uploadedFiles: uploadedFiles })
  }

  render() {
    return (
      <div>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
          </style>
        <a href="./"><h1>Do The 7 Steps Hand Wash!</h1></a>
        <body>
          <FileUpload />
        </body>
        <div style={{ backgroundColor: "white", justifyContent: "center" }}>
          <section id='section2'>
            <div className="dropdown" style={{ textAlign: 'center', backgroundColor: 'orange' }}>
              <Dropdown>
                <Dropdown.Toggle

                  variant="secondary btn-sm"
                  id="dropdown-basic">
                  Choose Your File
        </Dropdown.Toggle>
                <Dropdown.Menu style={{ backgroundColor: '#73a47' }}>
                  {this.state.uploadedFiles.map(({ name, value }) => (
                    <Dropdown.Item key={name} value={value} onSelect={() => { this.handleDropdown(value) }} >{name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </section>
          <section id="section99">
            {this.state.videoUrl &&
              <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                <VideoPlayer videoUrl={this.state.videoUrl} />
              </div>
            }
          </section>
          <section id='section1' style={{ textAlign: 'center', backgroundColor: 'orange' }}>
            {
              this.state.isLoading ? <LoadingOverlay style={{ justifyContent: 'center', display: 'flex' }}
                active={this.state.isLoading}
                spinner
              >
                <p>Processing Your Model....</p>
              </LoadingOverlay> : <div />
            }
            {this.state.pythonOutput &&
              <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                <h2>{this.state.pythonOutput}</h2>
              </div>
            }
          </section>
          <h1> Check and Uncheck All Example </h1>
          <input type="checkbox" onClick={this.handleAllChecked} value="checkedall" /> Check / Uncheck All
        <ul>
            {
              this.state.uploadedFiles.map((uploadedFile) => {
                return (<CheckBox handleCheckChieldElement={this.handleCheckChieldElement}  {...uploadedFile} />)
              })
            }
          </ul>
          <Button onClick={() => { this.processSelect() }} variant="warning">Process</Button>
        </div>

      </div>
    );
  }
}


