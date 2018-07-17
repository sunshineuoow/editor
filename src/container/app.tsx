import * as React from 'react'
import './app.less'
const Editor = require('wangeditor') 

interface State {
  title: string
  section: string
  filename: string
}

const initialState:State = {
  title: '',
  section: '',
  filename: ''
}


class App extends React.Component {
  state: State = initialState
  editor: any = React.createRef()

  componentDidMount() {
    const elem = this.editor.current
    const editor = new Editor(elem)
    editor.customConfig.onchange = (html: string) => {
      this.postMessage({data: html, type: 'content'})
    }
    editor.create()
    const frame = document.querySelector('iframe') as HTMLIFrameElement
    if (frame.contentWindow) {
      frame.contentWindow.onload = () => {
        this.postMessage({data: {title: 'aaa', section: 'bbb'}, type: 'title'})
      }
    }
  }

  private postMessage(message: object): void {
    const frame = document.querySelector('iframe')
    if (frame && frame.contentWindow) {
      frame && frame.contentWindow.postMessage(message, window.location.origin)
    }
  }

  private handleChange(type: string, e: React.ChangeEvent): void {
    const value = e.target && (e.target as HTMLInputElement).value
    this.setState({[type]: value})
  }

  private handlePostTitle(): void {
    this.postMessage({data: this.state, type: 'title'})
  }

  private handleSetHtml(): void {
    console.log('setHtml')
  }

  public render() {
    return (
      <div>
        <div className="container">
          <iframe
            src="/mobile.html"
            frameBorder={0}
          ></iframe>
        </div>
        <div className="editor">
          <div className="input-item">
            章节标题：<input type="text" onChange={this.handleChange.bind(this, 'section')} />
          </div>
          <div className="input-item">
            当日标题：<input type="text" onChange={this.handleChange.bind(this, 'title')} />
          </div>
          <div className="input-item">
            文件名：<input type="text" onChange={this.handleChange.bind(this, 'filename')} />
          </div>
          <button className="editor-btn" onClick={this.handlePostTitle.bind(this)}>设置标题</button>
          <button className="editor-btn" onClick={this.handleSetHtml.bind(this)}>生成文件</button>
          <div id="editor" ref={this.editor}></div>
        </div>
      </div>
    )
  }
}

export default App