import * as React from 'react'
import './mobile.less'

interface State {
  content: string
  title: string
  section: string
}

const initialState: State = { 
  content: '<p>111</p>',
  title: '',
  section: ''
}

class Mobile extends React.Component<object, State> {
  state: State = initialState

  componentDidMount(): void {
    window.addEventListener('message', this.handleMessage.bind(this), false)
  }

  private handleMessage(e: any): void {
    if (e && e.data) {
      if (e.data.type === 'content') {
        this.setState({content: e.data.data})
      } else if (e.data.type === 'title') {
        this.setState({title: e.data.data.title, section: e.data.data.section})
      }
    }
  }

  public render() {
    const { content, title, section } = this.state
    return (
      <div>
        <div className="header">这是微信头部</div>
        <div className="title">{section} | {title}</div>
        <div className="content" dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    )
  }
}

export default Mobile
