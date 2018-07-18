const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const server = require('koa-static')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const app = new Koa()
const router = new Router()

router.post('/index', async (ctx, next) => {
  const { html, filename } = ctx.request.body
  fs.writeFileSync(path.join(__dirname, `files/${filename}.html`), html, 'utf-8')
  ctx.body = { r: true }
})

app.use(bodyParser())

app.use(server(path.join(__dirname, './dist')))


app.use(router.routes())

app.listen(10000, () => {
  console.log('server is running')
})