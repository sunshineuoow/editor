import $ from '../../util/dom'
import Editor from '../../editor'
import DropList from '../droplist'

export default class Color {
  editor: Editor
  $elem: any
  droplist: DropList
  type: string
  _active: boolean
  
  constructor(editor: Editor) {
    this.editor = editor
    this.$elem = $(
      `
        <div class="editor-menu__btn">
          <i class="w-e-icon-pencil2"></i>
        </div>
      `
    )
    this.type = 'droplist'

    const config = editor.config
    const colors = config.colors || []

    this._active = false

    this.droplist = new DropList(this, {
      width: 120,
      $title: $('<p>文字颜色</p>'),
      type: 'inline-block',
      list: colors.map((color: string) => {
        return { $elem: $(`<i style="color:${color};" class="w-e-icon-pencil2"></i>`), value: color }
      }),
      onClick: (val: string) => this._command(val)
    })
  }

  private _command(val: string): void {
    const editor = this.editor

    editor.cmd.do('foreColor', val)
  }
}