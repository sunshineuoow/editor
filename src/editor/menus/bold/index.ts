import $ from '../../util/dom'
import Editor from '../../editor'

export default class Bold {
  editor: Editor
  $elem: any
  type: string
  _active: boolean

  constructor(editor: Editor) {
    this.editor = editor
    this.$elem = $(
      `
        <div class="editor-menu__btn">
          <i class="w-e-icon-bold"></i>
        </div> 
      `
    )

    this.type = 'click'
    this._active = false
  }

  public onClick(e: Event): void{
    const editor = this.editor
    const isSelectEmpty = editor.selection.isSelectEmpty()

    editor.cmd.do('bold')

    if (isSelectEmpty) {
      editor.selection.collapseRange()
      editor.selection.restoreSelect()
    }
  }

  public tryChangeActive(e: Event) {
    const editor = this.editor
    const $elem = this.$elem
    if (editor.cmd.queryCommandState('bold')) {
      this._active = true
      $elem.addClass('menu-btn__active')
    } else {
      this._active = false
      $elem.removeClass('menu-btn__active')
    }
  }
}