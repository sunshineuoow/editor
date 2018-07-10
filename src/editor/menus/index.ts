import Editor from '../editor'
import MenuConstructors from './menu-list'

export default class Menu {
  editor: Editor
  menus: object

  constructor(editor: Editor) {
    this.editor = editor
    this.menus = {}
  }

  public init() {
    const editor = this.editor
    const config = editor.config || {}
    const configMenus = config.menus || []

    configMenus.forEach((menuKey: string) => {
      const MenuConstructor = MenuConstructors[menuKey]
      if (MenuConstructor && typeof MenuConstructor === 'function') {
        this.menus[menuKey] = new MenuConstructor(editor)
      }
    })

    this._addToToolbar()

    this._bindEvent()
  }

  private _addToToolbar(): void {
    const editor = this.editor
    const $toolbarDOM = editor.$toolbarDOM
    const menus = this.menus
    const config = editor.config

    const zIndex = config.zIndex + 1
    
    for (let key of Object.keys(menus)) {
      const menu = menus[key]
      const $elem = menu.$elem
      if ($elem) {
        $elem.css('zIndex', zIndex)
        $toolbarDOM.append($elem)
      }
    }
  }

  private _bindEvent(): void {
    const menus = this.menus
    const editor = this.editor

    for (let key of Object.keys(menus)) {
      const menu = menus[key]
      const type = menu.type

      if (!type) return

      const $elem = menu.$elem
      const droplist = menu.droplist

      if (type === 'click' && menu.onClick) {
        $elem.on('click', (e: Event) => {
          if (editor.selection.getRange() === null) return
          menu.onClick(e)
        })
      }

      if (type === 'droplist' && droplist) {
        $elem.on('mouseenter', () => {
          if (editor.selection.getRange() === null) return

          droplist.showTimeoutId = setTimeout(() => {
            droplist.show()
          }, 200)
        }).on('mouseleave', () => {
          droplist.hideTimeoutId = setTimeout(() => {
            droplist.hide()
          }, 0)
        })
      }

      if (type === 'panel' && menu.onClick) {
        $elem.on('click', (e: Event) => {
          e.stopPropagation()
          if (editor.selection.getRange() === null) return

          menu.onClick(e)
        })
      }
    }
  }

  public changeActive(): void {
    const menus = this.menus
    for (let key of Object.keys(menus)) {
      const menu = menus[key]
      if (menu.tryChangeActive) setTimeout(() => {menu.tryChangeActive()}, 100)
    }
  }
}