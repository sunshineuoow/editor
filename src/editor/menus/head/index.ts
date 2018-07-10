import $ from '../../util/dom'
import Editor from '../../editor'
import DropList from '../droplist'

export default class Head {
  editor: Editor
  $elem: any
  type: string
  _active: boolean
  droplist: DropList

  constructor(editor: Editor) {
    this.editor = editor
    this.$elem = $(
      `
        <div class="editor-menu__btn">
          <i class="w-e-icon-header"></i>
        </div> 
      `
    )

    this.type = 'droplist'
    this._active = false
    this.droplist = new DropList(this, {
      width: 100,
      $title: $('<p>设置标题</p>'),
      type: 'list',
      list: [
        { $elem: $('<h1>H1</h1>'), value: '<h1>' },
        { $elem: $('<h2>H2</h2>'), value: '<h2>' },
        { $elem: $('<h3>H3</h3>'), value: '<h3>' },
        { $elem: $('<h4>H4</h4>'), value: '<h4>' },
        { $elem: $('<h5>H5</h5>'), value: '<h5>' },
        { $elem: $('<p>正文</p>'), value: '<p>' }
      ],
      onClick: (value: string) => {
        this._command(value)
      }
    })
  }

  private _command(val: string): void {
    const editor = this.editor

    const $selectionDOM = editor.selection.getSelectContainerDOM()
    if (editor.$textDOM.equal($selectionDOM)) return

    editor.cmd.do('formatBlock', val)
  }

  public tryChangeActive(): void {
    const editor = this.editor
    const $elem = this.$elem
    const reg = /^h/i
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