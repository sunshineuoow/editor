import * as React from 'react'
import { splitHTML } from '../util'
import './mobile.less'

interface State {
  content: string[]
  title: string
  section: string
  nowIndex: number
}

const initialState: State = { 
  content: [],
  title: '',
  section: '',
  nowIndex: 0
}

class Mobile extends React.Component<object, State> {
  state: State = initialState

  componentDidMount(): void {
    window.addEventListener('message', this.handleMessage.bind(this), false)
  }

  private handleMessage(e: any): void {
    if (e && e.data) {
      if (e.data.type === 'content') {
        const content = splitHTML(e.data.data)
        this.setState({content})
      } else if (e.data.type === 'title') {
        this.setState({title: e.data.data.title, section: e.data.data.section})
      }
    }
  }

  private handlePageChange(isNext: boolean): void {
    const { content, nowIndex } = this.state
    const max = content.length - 1
    const min = 0
    let nextIndex = nowIndex - (isNext ? -1 : 1)
    if (nextIndex < min) nextIndex = min
    if (nextIndex > max) nextIndex = max
    this.setState({ nowIndex: nextIndex })
  }

  public render() {
    const { content, title, section, nowIndex } = this.state
    return (
      <div>
        <div className="header">这是微信头部</div>
        <div className="title">{section} | {title}</div>
        <div className="content" dangerouslySetInnerHTML={{__html: content[nowIndex]}}></div>
        <div className="footer">{nowIndex + 1} / {content.length}</div>
        <div className="btn-groups">
          <div className="btn" onClick={this.handlePageChange.bind(this, false)}>上一页</div>
          <div className="btn" onClick={this.handlePageChange.bind(this, true)}>下一页</div>
        </div>
      </div>
    )
  }
}

export default Mobile
