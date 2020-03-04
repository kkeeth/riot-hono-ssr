import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import routes from './routes'

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
app.use(routes)

app.listen(8080, () => {
  console.log('server running on port: 8080')
})
