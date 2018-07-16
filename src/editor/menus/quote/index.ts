import $ from '../../util/dom'
import Editor from '../../editor'

export default class Quote {
  editor: Editor
  $elem: any
  type: string
  _active: boolean

  constructor(editor: Editor) {
    this.editor = editor
    this.$elem = $(
      `
        <div class="editor-menu__btn">
          <i class="w-e-icon-quotes-left"></i>
        </div>
      `
    )
    this.type = 'click'

    this._active = false
  }

  public onClick(): void {
    const editor = this.editor
    const $selectionDOM = editor.selection.getSelectContainerDOM()
    const nodeName = $selectionDOM.getNodeName()

    if (nodeName.toLowerCase() === 'blockquote') {
      editor.cmd.do('formateBlock', '<P>')
    } else {
      editor.cmd.do('formatBlock', '<BLOCKQUOTE>')
    }
    return
  }

  public tryChangeActive(): void {
    const editor = this.editor
    const $elem = this.$elem
    const reg = /^BLOCKQUOTE$/i
    const cmdVal = editor.cmd.queryCommandValue('formatBlock')
    if (reg.test(cmdVal)) {
      this._active = true
      $elem.addClass('menu-btn__active')
    } else {
      this._active = false
      $elem.removeClass('menu-btn__active')
    }
  }
}