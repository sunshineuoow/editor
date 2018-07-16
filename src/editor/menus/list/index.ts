import $ from '../../util/dom'
import DropList from '../droplist'
import Editor from '../../editor'


export default class List {
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
          <i class="w-e-icon-list2"></i>
        </div>
      `
    )
    this.type = 'droplist'

    this._active = false

    this.droplist = new DropList(this, {
      width: 120,
      $title: $('<p>设置列表</p>'),
      type: 'list',
      list: [
        { $elem: $('<span><i class="w-e-icon-list-numbered"></i> 有序列表</span>'), value: 'insertOrderedList' },
        { $elem: $('<span><i class="w-e-icon-list2"></i> 无序列表</span>'), value: 'insertUnorderedList' }
      ],
      onClick: (val: string) => this._command(val)
    })
  }

  private _command(val: string): void {
    const editor = this.editor
    const $textDOM = editor.$textDOM
    if (editor.cmd.queryCommandState(val)) return

    editor.cmd.do(val)

    let $selectionDOM = editor.selection.getSelectContainerDOM()
    if ($selectionDOM.getNodeName().toLowerCase() === 'li') $selectionDOM = $selectionDOM.parent()

    if (/^ol|ul$/i.test($selectionDOM.getNodeName()) === false) return
    if ($selectionDOM.equal($textDOM)) return

    const $parent = $selectionDOM.parent()
    if ($parent.equal($textDOM)) return

    $selectionDOM.insertAfter($parent)
    $parent.remove()
  }

  public tryChangeActive(): void {
    const editor = this.editor
    const $elem = this.$elem
    if (editor.cmd.queryCommandState('insertUnorderList') || editor.cmd.queryCommandState('insertOrderedList')) {
      this._active = true
      $elem.addClass('menu-btn__active')
    } else {
      this._active = false
      $elem.removeClass('menu-btn__active')
    }
  }
}