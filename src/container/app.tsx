import * as React from 'react'
import './app.less'
import Editor from '../editor/index'

interface State {
  title: string
  section: string
}

const initialState:State = {
  title: '',
  section: ''
}


class App extends React.Component {
  state: State = initialState

  componentDidMount() {
    const editor = new Editor('#editor')
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
          <button onClick={this.handlePostTitle.bind(this)}>设置标题</button>
          <div id="editor">
            <button onClick={this.postMessage.bind(this, {type: 'content', data: 'aaa'})}>点我发送消息</button>
          </div>
        </div>
      </div>
    )
  }
}

export default App