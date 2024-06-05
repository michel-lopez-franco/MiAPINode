// Este servidor va a regresar personas

const express = require('express')
const path = require('path')
const PORT = 3001

const personas = require('./personas.json').personas

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/personas', (req, res) => {
  res.sendFile(path.join(__dirname, 'personas.json'))
  console.log('Server is running on port 3000')
})

// Route parameters
/* Route parameters are named URL segments that are used to capture
the values specified at their position in the URL.
The captured values are populated in the req.params object,
with the name of the route parameter specified
in the path as their respective keys. */

app.get('/personas/:id(\\d+)', (req, res) => {
  console.log(req.params)
  const id = req.params.id
  console.log(personas[0])
  console.log(personas[id])
  // const cad = `Persona con id ${id} es ${JSON.stringify(personas[id])}`
  // console.log(cad)
  // res.send(`Persona con id ${id} es ${personas[id]}`)
  // res.send(cad)
  res.json(personas[id])
})

app.post('/personas', (req, res) => {
  // recuperar el body
  // const { nombre, edad, email } = req.body
  let body = ''
  req.on('data', chunk => {
    console.log(chunk.toString())
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })

    data.timestamp = Date.now()

    res.end(JSON.stringify(data))
  })

  console.log('body: ', body)

  // res.contentType('text/html; charset=utf-8')
  // res.contentType('text/plain')
  /* res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.statusCode = 201
  res.send('Persona creada')
  */
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `)
  console.log(`http://localhost:${PORT}`)
})
