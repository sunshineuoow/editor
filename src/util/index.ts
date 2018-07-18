const ulReg = /<ul>.*?<\/ul>/g
const blockReg = /(<blockquote>.*?<\/blockquote>)+/g
const brReg = /<p><br><\/p>/g
const hrReg = /<p>hr<\/p>/g
const splitReg = /<p>splitLine<\/p>/g
const imgReg = /<p><img.*?src="(.*?)".*?><\/p>/g
const ratioReg = /style="max-width:(.*?)%"/g
const aReg = /<a.*?><img.*?><\/a>/g
const sizeReg = /data-size="(.*?)"/g

export const transferHTML = (html: string): string => {
  html = html.replace(imgReg, (match: string, p1: string) => {
    if (match.indexOf('data-size') >= 0) {
      const ratioResult = ratioReg.exec(match) || ['100']
      const ratio = parseFloat(ratioResult[0])
      const className = ratio === 1 ? 'img-l' : ratio === 0.5 ? 'img-m' : 'img-s'
      match = `
        <a
          class="${className}"
          href="${p1}"
          itemprop="contentUrl"
          data-size="600x400"
          data-med="${p1}"
        >
          ${match}
        </a.>`.replace(/<\/?p>/g, '').replace('<img', '<img itemprop="thumbnail"')
    }
    return match
  })
  html = html.replace(ulReg, (match: string) => {
    match = match.replace(/<li>/g, '<li class="list-item">')
    return match
  })
  html = html.replace(blockReg, (match: string) => {
    match = `<div class="formula">${match}</div>`.replace('blockquote', 'p')
    return match
  })
  html = html.replace(brReg, '<div class="br"></div>').replace(hrReg, '<div class="hr"></div>').replace(splitReg, 'splitLine')
  return html
}

export const  splitHTML = (html: string): string[] => {
  return html.split('splitLine')
}

export const addImgSize = (html: string): string => {
  return html.replace(aReg, (match: string): string => {
    sizeReg.test(match)
    return match.replace('<a', `<a data-med-size="${RegExp.$1}"`)
  })
}