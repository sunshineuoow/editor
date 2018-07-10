import $ from '../util/dom'
import SelectionAPI from '../menus/selection'
import Command from '../command'
import Menus from '../menus'
import Text from '../text'
import _config from '../config'
import '../less/index.less'

let editorId = 1

interface Config {
  [propName: string]: any
}

export default class Editor {
  
  id: string
  selection: SelectionAPI
  cmd: Command
  menus: Menus
  txt: Text
  rootDOM: HTMLElement
  config: Config
  customConfig: object | undefined
  change: Function
  $textContainerDOM: any
  $textDOM: any
  $toolbarDOM: any
  _useStyleWithCSS: boolean

  constructor(selector: string, config?: object) {
    if (!selector) {
      throw new Error('editor needs a DOM selector to init')
    }

    this.rootDOM = document.querySelector(selector) as HTMLElement
    this.id = `editor${editorId}`
    this.customConfig = config
  }

  private _initConfig():void {
    let target = {}
    this.config = Object.assign(target, _config, this.customConfig)
  }

  private _initDOM(): void {
    const $rootDOM = $(this.rootDOM)
    
    const config = this.config
    const zIndex = config.zIndex

    const $toolbarDOM = $('<div></div>')
    const $textContainerDOM = $('<div></div>')

    $rootDOM.append($toolbarDOM).append($textContainerDOM)

    $toolbarDOM.css('backgroundColor', '#f1f1f1').css('border', '1px solid #ccc')
    $textContainerDOM.css('border', '1px solid #ccc').css('border-top', 'none')


    const $textareaDOM = $('<div></div>')
    $textareaDOM.append($('<p><br></p>'))
    $textareaDOM.attr('contenteditable', 'true').css('width', '100%').css('height', '100%')

    $textContainerDOM.append($textareaDOM)

    $toolbarDOM.addClass('editor-toolbar')
    $textContainerDOM.addClass('editor-text-container').css('zIndex', zIndex)
    

    this.$toolbarDOM = $toolbarDOM
    this.$textContainerDOM = $textContainerDOM
    this.$textDOM = $textareaDOM

    // 记录输入法开始结束(防止a'a'a类似情况的出现)
    let compositionEnd = true

    $textContainerDOM.on('compositionstart', () => {
      compositionEnd = false
    })

    $textContainerDOM.on('compositionend', () => {
      compositionEnd = true
    })

    $textContainerDOM.on('keyup', () => {
      compositionEnd && this.change && this.change()
    })

    $toolbarDOM.on('click', () => {
      this.change && this.change()
    })
  }

  private _initCommand(): void {
    this.cmd = new Command(this)
  }

  private _initSelectionAPI(): void {
    this.selection = new SelectionAPI(this)
  }

  private _initMenus(): void {
    this.menus = new Menus(this)
    this.menus.init()
  }

  private _initText(): void {
    this.txt = new Text(this)
    this.txt.init()
  }

  public initSelection(newLine?: boolean) {
    const $textDOM = this.$textDOM
    const $children = $textDOM.children()
    if (!$children.length) {
      $textDOM.append($('<p><br></p>'))
      this.initSelection()
      return
    }

    const $last = $children.last()

    if (newLine) {
      const html = $last.html().toLowerCase()
      const nodeName = $last.getNodeName()
      if (/^<br\s\/>$/.test(html) || nodeName.toLowerCase() !== 'p') {
        $textDOM.append($('<p><br></p>'))
        this.initSelection()
        return
      }
    }

    this.selection.createRangeByDOM($last, false, true)
    this.selection.restoreSelect()
  }

  private _bindEvent(): void {
    let onChangeTimeoutId = 0
    let beforeChangeHtml = this.txt.html() as string
    const config = this.config

    let onchangeTimeout = config.onchangeTimeout
    onchangeTimeout = parseInt(onchangeTimeout, 10)
    if (!onchangeTimeout || onchangeTimeout <= 0) onchangeTimeout = 200

    const onchange = config.onchange
    if (onchange && typeof onchange === 'function') {
      this.change = function() {
        let currentHtml = this.txt.html() as string

        if (currentHtml.length === beforeChangeHtml.length) {
          if (currentHtml === beforeChangeHtml) return
        }

        if (onChangeTimeoutId) clearTimeout(onChangeTimeoutId)

        onChangeTimeoutId = setTimeout(() => {
          onchange(currentHtml)
          beforeChangeHtml = currentHtml
        }, onchangeTimeout)
      }
    }
  }

  public create(): void {
    this._initConfig()
    this._initDOM()
    this._initCommand()
    this._initSelectionAPI()
    this._initMenus()
    this._initText()

    this.initSelection(true)

    this._bindEvent()
  }
}
