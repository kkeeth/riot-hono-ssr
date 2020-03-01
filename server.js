import express from 'express'
import { fragments, renderAsyncFragments } from '@riotjs/ssr'
import register from '@riotjs/ssr/register'
import template from 'lodash.template'
import { readFileSync } from 'fs'

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

app.use(express.static('public'))

// routing
app.get('/', async (req, res) => {
  const { html, css } = await ssr('hello', {})
  res.send(template(page)({ html, css }))
})

app.get('/:page', (req, res) => {
  const { html, css } = ssr(req.params.page, {})
  res.send(template(page)({ html, css }))
})

app.listen(8080, () => {
  console.log('server running on port: 8080')
})
