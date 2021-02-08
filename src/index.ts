import express from 'express'
import rateLimit from 'express-rate-limit'
import * as fs from 'fs-extra'
import * as path from 'path'

const words = fs
  .readFileSync(path.join(__dirname, '../words.txt'))
  .toString()
  .split('\n')

function getRandomWord(): string {
  return words[Math.floor(Math.random() * words.length)]
}

const app = express()
const MAX_COUNT = 10

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
})

app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get<{ count: string }>('/:count', function (req, res) {
  const count = parseInt(req.params.count)

  if (count < 0) {
    res.status(400).send({
      error: {
        message: 'count must be greater than 0.',
      },
    })
    return
  }

  if (count > MAX_COUNT) {
    res.status(400).send({
      error: {
        message: `count must be greater than ${MAX_COUNT}.`,
      },
    })
    return
  }

  const words: string[] = []

  for (let i = 0; i < count; ++i) {
    words.push(getRandomWord())
  }

  res.send({
    words,
  })
})

app.listen(10000, () => {
  console.log('ready')
})

setInterval(() => {
  console.log('...')
}, 9999999)
