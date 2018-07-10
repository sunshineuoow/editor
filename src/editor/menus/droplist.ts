import $ from '../util/dom'


const _emptyFn = () => {}

export default class DropList {
  menu: any
  opt: any
  $container: any
  hideTimeoutId: number
  _rendered: boolean
  _show: boolean

  constructor(menu: any, opt: any) {
    this.menu = menu
    this.opt = opt

    const $container = $('<div class="editor-droplist"></div>')

    const $title = opt.$title

    if ($title) {
      $title.addClass('editor-droplist__title')
      $container.append($title)
    }

    const list = opt.list || []
    const type = opt.type || 'list'
    const onClick = opt.onClick || _emptyFn

    const $list = $(`<ul class='${type === 'list' ? 'editor-list' : 'editor-block'}'></ul>`)
    $container.append($list)
    list.forEach((item: any) => {
      const $elem = item.$elem
      
      const value = item.value

      const $li = $('<li class="editor-droplist__item"></li>')
      if ($elem) {
        $li.append($elem)
        $list.append($li)
        $li.on('click', () => {
          onClick(value)
          this.hideTimeoutId = window.setTimeout(() => {
            this.hide()
          }, 0)
        })
      }
    })

    $container.on('mouseleave', () => {
      this.hideTimeoutId = window.setTimeout(() => {
        this.hide()
      }, 0)
    })

    this.$container = $container
    
    this._rendered = false
    this._show = false
  }

  public show(): void {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId)
    }

    const menu = this.menu
    const $menuElem = menu.$elem
    const $container = this.$container
    if (this._show) return
    if (this._rendered) {
      $container.show()
    } else {
      const menuHeight = $menuElem.getSizeData().height || 0
      const width = this.opt.width || 100
      $container.css('marginTop', menuHeight + 'px').css('width', width + 'px')

      $menuElem.append($container)
      this._rendered = true
    }
    
    this._show = true
  }

  public hide(): void {
    const $container = this.$container
    if (!this._show) return

    $container.hide()
    this._show = false
  }
}