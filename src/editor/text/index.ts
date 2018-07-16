// import $ from '../util/dom'
import Editor from '../editor'

export default class Text {
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public init(): void {
    this._bindEvent()
  }

  public clear(): void {
    this.html('<p><br></p>')
  }

  public html(val?: string): string | void {
    const editor = this.editor
    const $textDOM = editor.$textDOM
    let html
    if (val === null || val === undefined) {
      html = $textDOM.html()
      html = html.replace(/\u200b/gm, '')
      return html
    } else {
      $textDOM.html(val)

      editor.initSelection()
    }
  }

  public text(val?: string): string | void {
    const editor = this.editor
    const $textDOM = editor.$textDOM
    let text
    if (val === null || val === undefined) {
      text = $textDOM.text()
      text = text.repalce(/\u200b/gm, '')
      return text
    } else {
      $textDOM.text(`<p>${val}</p>`)

      editor.initSelection()
    }
  }

  private _bindEvent(): void {
    this._saveRange()
  }

  private _saveRange(): void {
    const editor = this.editor
    const $textDOM = editor.$textDOM

    const saveRange = () => {
      editor.selection.saveRange()

      editor.menus.changeActive()
    }

    $textDOM.on('keyup', saveRange)
    $textDOM.on('mousedown', () => {
      $textDOM.on('mouseleave', saveRange)
    })
    $textDOM.on('mouseup', () => {
      saveRange()
      $textDOM.off('mouseleave', saveRange)
    })
  }
}