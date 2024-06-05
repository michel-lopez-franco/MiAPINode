const express = require('express')
// const path = require('path')
const app = express()

app.disable('x-powered-by')

// ?? se llama operador de coalescencia nula
const PORT = process.env.PORT ?? 3000

const personas = require('./personas.json').personas

app.use(express.json())

app.use((req, res, next) => {
  // tracker la request a la base de datos
  // revisar si el usuario tiene cookies
  console.log('--------------------------------------')
  console.log('Middleware 1')
  console.log('method: ', req.method)
  console.log('url: ', req.url)
  console.log('headers: ', req.headers)
  console.log('query: ', req.query)
  console.log('body: ', req.body)
  console.log('params: ', req.params)
  console.log('cookies: ', req.cookies)
  next()
})

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.status(200).send('<h1>Hello World!</h1>')
})

app.get('/personas', (req, res) => {
  // res.sendFile(path.join(__dirname, 'personas.json'))
  res.json(personas)
})

app.get('/personas/:id', (req, res) => {
  const { id } = req.params
  const persona = personas[id]

  if (persona) {
    res.json(persona)
  } else {
    res.status(404).json({ error: 'Persona no encontrada' })
  }
})

app.post('/personas', (req, res) => {
  console.log(JSON.stringify(req.body))
  const { nombre, edad, apellido } = req.body
  personas.push({ nombre, edad, apellido })

  res.status(201).json(req.body)
})

// La ultima a la que va allegar
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})
