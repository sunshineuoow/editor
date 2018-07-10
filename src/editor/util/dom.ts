function createElemByHtml(html: string): HTMLCollection {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.children
}

function isDOMList(list: any): boolean {
  if (!list) return false
  
  if (list instanceof HTMLCollection || list instanceof NodeList) return true
  
  return false
}

function querySelectorAll(selector: string): NodeList | Array<NodeListOf<Element>> {
  const result = document.querySelectorAll(selector)
  if (isDOMList(result)) {
    return result
  } else {
    return [result]
  }
}

const eventList: object[] = []

class DOMElement {
  selector: any
  length: number

  constructor(selector: any) {
    if (!selector) return

    if (selector instanceof DOMElement) return selector

    this.selector = selector
    const nodeType = selector.nodeType

    let selectorResult: any[] | NodeList = []
    if (nodeType === 9) {
      // domcument
      selectorResult = [selector]
    } else if (nodeType === 1) {
      // 单个DOM
      selectorResult = [selector]
    } else if (isDOMList(selector) || Array.isArray(selector)) {
      selectorResult = selector
    } else if (typeof selector === 'string') {
      // 字符串
      selector = selector.trim()
      if (selector.indexOf('<') === 0) {
        selectorResult = createElemByHtml(selector)
      } else {
        selectorResult = querySelectorAll(selector)
      }
    }

    const length = selectorResult.length

    if (!length) return this

    let i: number
    for (i = 0; i < length; i++) this[i] = selectorResult[i]
    
    this.length = length
  }

  public forEach(fn: (elem: HTMLElement, i?: number) => void): DOMElement {
    let i: number, elem: HTMLElement
    for (i = 0; i < this.length; i++) {
      elem = this[i]
      const result = fn.call(elem, elem, i)
      if (result === false) break
    }
    return this
  }

  public get(index: number): DOMElement {
    const length = this.length
    if (index >= length) index %= length
    return $(this[index])
  }

  public first(): DOMElement {
    return this.get(0)
  }

  public last(): DOMElement {
    const length = this.length - 1
    return this.get(length)
  }

  public on(type: string, selector: any, fn?: any): DOMElement {
    if (!fn) {
      fn = selector
      selector = null
    }

    let types = type.split(/\s+/)

    return this.forEach(elem => {
      types.forEach(type => {
        if (!type) return

        eventList.push({elem, type, fn})

        if (!selector) {
          elem.addEventListener(type, fn)
          return
        }

        elem.addEventListener(type, e => {
          const target = e.target as HTMLElement
          if (target.matches(selector)) fn.call(target, e)
        })
      })
    })
  }

  public off(type: string, fn: () => void): DOMElement {
    return this.forEach(elem => elem.removeEventListener(type, fn))
  }

  public attr(key: string, val?: any): any {
    if (val === undefined || val === null) {
      return this[0].getAttribute(key)
    } else {
      return this.forEach(elem => elem.setAttribute(key, val))
    }
  } 

  public addClass(className: string): DOMElement {
    if (!className) return this

    return this.forEach(elem => {
      if (elem.className) {
        if (elem.className.indexOf(className) < 0) elem.className = `${elem.className} ${className}`
      } else {
        elem.className = className
      }
    })
  }

  public removeClass(className: string): DOMElement {
    if (!className) return this
    return this.forEach(elem => {
      let arr
      if (elem.className) {
        arr = elem.className.split(/\s/)
        arr = arr.filter(item => {
          item = item.trim()
          if (!item || item === className) return false
          return true
        })
        elem.className = arr.join(' ')
      }
    })
  }

  public css(key: string, val?: string): any {
    if (val === undefined || val === null) return this[0].style[key]

    return this.forEach(elem => elem.style[key] = val)
  }

  public show(): DOMElement {
    return this.css('display', 'block')
  }

  public hide(): DOMElement {
    return this.css('display', 'none')
  }

  public children(): DOMElement | null {
    const elem = this[0]
    if (!elem) return null

    return $(elem.children)
  }

  public childNodes(): DOMElement | null {
    const elem = this[0]
    if (!elem) return null
    return $(elem.childNodes)
  }

  public append($dom: DOMElement): DOMElement {
    return this.forEach(elem => {
      $dom.forEach((child: HTMLElement) => {
        elem.appendChild(child)
      })
    })
  }

  public isContain($child: any): boolean {
    const elem = this[0]
    const child = $child[0]
    return elem.contains(child)
  }

  public getSizeData(): ClientRect | DOMRect {
    const elem = this[0] as HTMLElement
    return elem.getBoundingClientRect()
  }

  public getNodeName(): string {
    const elem = this[0]
    return elem.nodeName
  }

  public html(val?: string): DOMElement | string {
    const elem = this[0]
    if (val === null || val === undefined) {
      return elem.innerHTML
    } else {
      elem.innerHTML = val
      return this
    }
  }

  public parent(): DOMElement {
    const elem = this[0]
    return $(elem.parentElement)
  }

  public parentUntil(selector: string, _currentDOM?: HTMLElement): null | DOMElement {
    const results = document.querySelectorAll(selector)
    const length = results.length
    if (!length) return null

    const elem = _currentDOM || this[0]
    if (elem.nodeName === 'BODY') return null

    const parent = elem.parentElement
    let i: number
    for (i = 0; i < length; i++) {
      if (parent === results[i]) return $(parent)
    }

    return this.parentUntil(selector, parent)
  }

  public equal($dom: any): boolean {
    if ($dom.nodeType === 1) {
      return this[0] === $dom
    } else {
      return this[0] === $dom[0]
    }
  }
}

function $(selector: any): DOMElement {
  return new DOMElement(selector)
}

export default $
