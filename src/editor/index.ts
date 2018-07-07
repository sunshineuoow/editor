let editorId = 1

class Editor {
  
  id: string
  rootDOM: Element
  customConfig: object | undefined

  constructor(selector: string, config?: object) {
    if (!selector) {
      throw new Error('editor needs a DOM selector to init')
    }

    this.rootDOM = document.querySelector(selector) as HTMLElement
    this.id = `editor${editorId}`
    this.customConfig = config 
  }

  private _initConfig():void {

  }

  private _initDOM(): void {
    const toolBarDOM = document.createElement('div')
    const textareaDOM = document.createElement('div')

    textareaDOM.setAttribute('contenteditable', 'true')
    textareaDOM.style.width = '100%'
    textareaDOM.style.height = '100%'
    toolBarDOM.style.backgroundColor = '#f2f2f2'
    textareaDOM.innerHTML = '<p><br></p>'
    this.rootDOM.appendChild(toolBarDOM)
    this.rootDOM.appendChild(textareaDOM)

    // 记录输入法开始结束(防止a'a'a类似情况的出现)
    let compositionEnd = true

    textareaDOM.addEventListener('compositionstart', () => {
      compositionEnd = false
    })

    textareaDOM.addEventListener('compositionend', () => {
      compositionEnd = true
    })

    textareaDOM.addEventListener('keyup', () => {
      compositionEnd && this.change && this.change()
    })
  }

  public change() {
    const textareaDOM = this.rootDOM.lastChild as HTMLElement
    console.log(textareaDOM.innerHTML)
  }

  public create(): void {
    this._initConfig()
    this._initDOM()
  }
}

export default Editor