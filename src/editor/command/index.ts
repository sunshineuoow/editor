// import $ from '../util/dom'
import Editor from '../editor'

export default class Command {
  editor: Editor

  constructor(editor: Editor) {
    this.editor = editor
  }

  public do(name: string, value?: any) {
    const editor = this.editor

    if (!editor._useStyleWithCSS) {
      document.execCommand('styleWithCSS', undefined, true)
      editor._useStyleWithCSS = true
    }

    if (!editor.selection.getRange()) return

    editor.selection.restoreSelect()

    const _name = '_' + name
    if (this[_name]) {
      this[_name](value)
    } else {
      this._execCommand(name, value)
    }

    editor.menus.changeActive()

    editor.selection.saveRange()
    editor.selection.restoreSelect()

    editor.change && editor.change()
  }

  // private _insertHTML(html: string): void {
  //   const editor = this.editor
  //   const range = editor.selection.getRange() as Range

  //   if (this.queryCommandSupported('insertHTML')) {
  //     this._execCommand('insertHTML', html)
  //   } else if (range.insertNode) {
  //     range.deleteContents()
  //     range.insertNode($(html)[0])
  //   }
  // }

  // private _insertDOM($dom: any): void {
  //   const editor = this.editor
  //   const range = editor.selection.getRange() as Range

  //   if (range.insertNode) {
  //     range.deleteContents()
  //     range.insertNode($dom[0])
  //   }
  // }

  private _execCommand(name: string, value: any): void {
    console.log(name)
    document.execCommand(name, false, value)
  }

  public queryCommandValue(name: string): string {
    return document.queryCommandValue(name)
  }

  public queryCommandState(name: string): boolean {
    return document.queryCommandState(name)
  }

  public queryCommandSupported(name: string): boolean {
    return document.queryCommandSupported(name)
  }
}