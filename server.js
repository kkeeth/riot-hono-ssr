import express from 'express'
import { fragments, renderAsyncFragments } from '@riotjs/ssr'
import register from '@riotjs/ssr/register'
import template from 'lodash.template'
import { readFileSync } from 'fs'
import path from 'path'
import favicon from 'serve-favicon'

const page = readFileSync('./index.html', 'utf8')

// register .riot extension
register()

// SSR
const ssr = (file, obj) => {
  try {
    // load riot file
    const RiotTag = require(`./pages/${file}.riot`).default
    // rendering
    return renderAsyncFragments(RiotTag.name, RiotTag, obj)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      const NotFound = require('./pages/not-found.riot').default
      return fragments('not-found', NotFound, { params: e })
    }
    else {
      const Error = require('./pages/error.riot').default
      return fragments('error', Error, { params: e })
    }
  }
};

// express instance
const app = express()
// static directory path
app.use(express.static('public'))
// favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
// Etag
app.set('etag', false)
// x-powered-by
app.set('x-powered-by', false)

// routing
app.get('/', async (req, res) => {
  const { html, css } = await ssr('hello', {})
  res.send(template(page)({
    html,
    css,
    title: 'Riot App'
  }))
})

app.get('/:page', (req, res) => {
  const { html, css } = ssr(req.params.page, {})
  res.send(template(page)({
    html,
    css,
    title: 'Error Page'
  }))
})

app.listen(8080, () => {
  console.log('server running on port: 8080')
})
