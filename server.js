import express from 'express'
import { render, renderAsync } from '@riotjs/ssr'
import register from '@riotjs/ssr/register'

// register .riot extension
register()

// SSR
const ssr = (file, obj) => {
  try {
    // load riot file
    const tag = require(`./components/${file}.riot`).default
    // rendering
    return renderAsync(tag.name, tag, obj)
  } catch (e) {
    console.log(e)
   // return file !== 'notfound' ? ssr('not-found', e) : {};
  }
};
const app = express()

app.use(express.static('public'))

// routing
app.get('/', (req, res) => {
  ssr('hello', {})
    .then(html => {
      res.send(html)
    })
    .catch(e => {
      const Error = require('./components/error.riot').default
      res.send(render('error', Error, { params: e }))
    })
})

app.listen(8080, () => {
  console.log('server running on port: 8080')
})
