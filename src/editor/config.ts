interface Config {
  [propName: string]: any
}

const config: Config = {
  menus: ['head', 'bold', 'color', 'fontSize', 'bgColor', 'list', 'quote'],

  colors: [
    '#000000',
    '#eeece0',
    '#1c487f',
    '#4d80bf',
    '#c24f4a',
    '#8baa4a',
    '#7b5ba1',
    '#46acc8',
    '#f9963b',
    '#ffffff'
  ],

  zIndex: 1000,

  debug: false
}

export default config
