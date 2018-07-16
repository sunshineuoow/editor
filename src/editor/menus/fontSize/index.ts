import $ from '../../util/dom'
import DropList from '../droplist'
import Editor from '../../editor'

export default class FontSize {
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
          <i class="w-e-icon-text-heigh"></i>
        </div>
      `
    )
    this.type = 'droplist'
    this._active = false

    this.droplist = new DropList(this, {
      width: 160,
      $title: $('<p>字号</p>'),
      type: 'list',
      list: [
        { $elem: $('<span style="font-size: x-small;">x-small</span>'), value: '1' },
        { $elem: $('<span style="font-size: small;">small</span>'), value: '2' },
        { $elem: $('<span>normal</span>'), value: '3' },
        { $elem: $('<span style="font-size: large;">large</span>'), value: '4' },
        { $elem: $('<span style="font-size: x-large;">x-large</span>'), value: '5' },
        { $elem: $('<span style="font-size: xx-large;">xx-large</span>'), value: '6' }
      ],
      onClick: (val: string) => this._command(val)
    })
  }

  private _command(val: string): void {
    const editor = this.editor

    editor.cmd.do('fontSize', val)
  }
}