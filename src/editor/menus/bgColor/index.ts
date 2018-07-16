import $ from '../../util/dom'
import DropList from '../droplist'
import Editor from '../../editor'

export default class BgColor {
  editor: Editor
  type: string
  $elem: any
  _active: boolean
  droplist: DropList

  constructor(editor: Editor) {
    this.editor = editor
    this.$elem = $(
      `
        <div class="editor-menu__btn">
          <i class="w-e-icon-paint-brush"></i>
        </div>
      `
    )

    const config = editor.config
    const colors = config.colors || []

    this.type = 'droplist'

    this._active = false

    this.droplist = new DropList(this, {
      width: 120,
      $title: $('<p>背景色</p>'),
      type: 'inline-block',
      list: colors.map((color:string) => {
        return { $elem: $(`<i style="color:${color};" class="w-e-icon-paint-brush"></i>`), value: color }
      }),
      onClick: (val: string) => this._command(val)
    })
  }

  private _command(val: string): void {
    const editor = this.editor

    editor.cmd.do('backColor', val)
  }
}