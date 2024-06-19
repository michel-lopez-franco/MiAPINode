// Ejemplos basicos utilizando javascript
const personas = [{ id: 1, nombre: 'michel', edad: 18 }, { id: 2, nombre: 'michel', edad: 18 }, { id: 3, nombre: 'michel', edad: 18 }]

console.log('Muestra personas: ', personas)

// Ejemplo de como obtener un objeto de un array
const persona = personas.find(persona => persona.id === 2)

console.log(persona)

const nuevoNombre = { nombre: 'daris' }

const nuevapersona = {
  ...persona,
  ...nuevoNombre
}

console.log(nuevapersona)

const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5] // arr2 ahora es [1, 2, 3, 4, 5]

console.log(arr2)

const obj1 = { a: 1, b: 2 }
const obj2 = { ...obj1, c: 3 } // obj2 ahora es { a: 1, b: 2, c: 3 }

console.log(obj2)

function sum (...args) {
  return args.reduce((prev, curr) => prev + curr, 0)
}

console.log(sum(1, 2, 3, 4)) // Imprime 10
