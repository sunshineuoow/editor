interface MenuConstructors {
  [propName: string]: any
}

const MenuConstructors: MenuConstructors = {}

import Head from './head'
MenuConstructors.head = Head

import Bold from './bold'
MenuConstructors.bold = Bold

import Color from './color'
MenuConstructors.color = Color

import FontSize from './fontSize'
MenuConstructors.fontSize = FontSize

import BgColor from './bgColor'
MenuConstructors.bgColor = BgColor

import List from './list'
MenuConstructors.list = List

import Quote from './quote'
MenuConstructors.quote = Quote

export default MenuConstructors