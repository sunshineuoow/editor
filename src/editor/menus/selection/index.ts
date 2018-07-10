import $ from '../../util/dom'
import Editor from '../../editor'

export default class API {
  editor: Editor
  _currentRange: Range

  constructor(editor: Editor) {
    this.editor = editor
  }

  public getRange(): Range {
    return this._currentRange
  }

  public saveRange(_range?: Range): void {
    if (_range) {
      this._currentRange = _range
      return
    }

    const selection = window.getSelection()
    if (selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)

    const $containerDOM = this.getSelectContainerDOM(range)
    if (!$containerDOM) return

    if ($containerDOM.attr('contenteditable') === 'false' || $containerDOM.parentUntil('[contenteditable=false]')) return

    const editor = this.editor
    const $textDOM = editor.$textDOM
    if ($textDOM.isContain($containerDOM)) this._currentRange = range
  }

  public collapseRange(toStart?: boolean ) {
    if (toStart === null || toStart === undefined) toStart = false
    const range = this._currentRange
    if (range) range.collapse(toStart)
  }

  public getSelectContainerDOM(range?: Range): any {
    range = range || this._currentRange
    let elem
    if (range) {
      elem = range.commonAncestorContainer
      return $(
        elem.nodeType === 1 ? elem : elem.parentNode
      )
    }
  }

  public getSelectStartDOM(range: Range): any {
    range = range || this._currentRange
    let elem
    if (range) {
      elem = range.startContainer
      return $(
        elem.nodeType === 1 ? elem : elem.parentNode
      )
    }
  }

  public getSelectEndDOM(range: Range): any {
    range = range || this._currentRange
    let elem
    if (range) {
      elem = range.endContainer
      return $(
        elem.nodeType === 1 ? elem : elem.parentElement
      )
    }
  }

  public isSelectEmpty(): boolean {
    const range = this._currentRange
    if (range && range.startContainer) {
      if (range.startContainer === range.endContainer) {
        if (range.startOffset === range.endOffset) {
          return true
        }
      }
    }
    return false
  }

  public restoreSelect() {
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(this._currentRange as Range)
  }

  public createRangeByDOM($dom: any, toStart: boolean, isContent: boolean): void {
    if (!$dom.length) return

    const elem = $dom[0]
    const range = document.createRange()

    if (isContent) {
      range.selectNodeContents(elem)
    } else {
      range.selectNode(elem)
    }

    if (typeof toStart === 'boolean') range.collapse(toStart)

    this.saveRange(range)
  }
}