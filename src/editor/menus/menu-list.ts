interface MenuConstructors {
  [propName: string]: any
}

const MenuConstructors: MenuConstructors = {}

import Head from './head'
MenuConstructors.head = Head

import Bold from './bold'
MenuConstructors.bold = Bold

export default MenuConstructors