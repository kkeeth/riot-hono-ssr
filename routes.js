import { Router } from 'express'
import { fragments, renderAsyncFragments } from '@riotjs/ssr'
import register from '@riotjs/register'
import template from 'lodash.template'
import { readFileSync } from 'fs'

// register .riot extension
register()

// base page
const page = readFileSync('./index.html', 'utf8')

// router instance
const router = Router()

// SSR
const ssr = async (file, obj) => {
  try {
    // load riot file
    const RiotTag = require(`./pages/${file}.riot`).default
    // rendering
    const { html, css } = await renderAsyncFragments(RiotTag.name, RiotTag, obj)
    return {
      html: html,
      css: css,
      title: `${file} Page`,
    }
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      const NotFound = require('./pages/not-found.riot').default
      return {
        ...fragments('not-found', NotFound, { params: e }),
        title: 'Not Found',
      }
    } else {
      const Error = require('./pages/error.riot').default
      return {
        ...fragments('error', Error, { params: e }),
        title: 'Error Page',
      }
    }
  }
}

// routers
router.get('/', async (req, res) => {
  const { html, css } = await ssr('app', {
    title: 'Hello Riot with Express!!',
  })
  res.send(
    template(page)({
      html,
      css,
      title: 'Riot App',
    }),
  )
})

router.get('/:page', async (req, res) => {
  const { html, css, title } = await ssr(req.params.page, {
    title: `${req.params.page} Page`,
  })
  res.send(
    template(page)({
      html,
      css,
      title: title,
    }),
  )
})

export default router
