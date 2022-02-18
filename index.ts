import express from 'express'
import Database from 'better-sqlite3'
import cors from 'cors'

const db = new Database('./data.db', {
  verbose: console.log
})
const app = express()
app.use(cors())
app.use(express.json())

const getAllUsers = db.prepare(`SELECT * FROM users;`)

const getUserById = db.prepare(`SELECT * FROM users WHERE id=?;`)

const createUser = db.prepare(`
INSERT INTO users (name) VALUES (?);
`)

app.get('/users', (req, res) => {
  const allUsers = getAllUsers.all()
  res.send(allUsers)
})

app.get('/users/:id', (req, res) => {
  const id = req.params.id
  const result = getUserById.get(id)

  if (result) {
    res.send(result)
  } else {
    res.status(404).send({ error: 'User not found.' })
  }
})

app.post('/users', (req, res) => {
  const name = req.body.name

  const errors = []

  if (typeof name !== 'string') {
    errors.push('Name is missing or not a string')
  }

  if (errors.length === 0) {
    // create the user on the DB
    const result = createUser.run(name)
    // get the user we just created on the DB
    const user = getUserById.get(result.lastInsertRowid)
    res.send(user)
  } else {
    res.status(400).send({ errors: errors })
  }
})

const updateUser = db.prepare(`
UPDATE users SET name=? WHERE id=?;
`)

app.patch('/users/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name

  // check if the id given actually exists
  const result = getUserById.get(id)

  // if it does exist:
  if (result) {
    // change the user in the DB
    updateUser.run(name, id)
    // get the updated user from the DB
    const updatedUser = getUserById.get(id)
    // send the updated user back
    res.send(updatedUser)
  }
  // if it doesn't exist:
  else {
    res.status(404).send({ error: 'User does not exist.' })
  }
})

const deleteUser = db.prepare(`
DELETE FROM users WHERE id=?;
`)

// app.delete('/users/:id', (req, res) => {
//   const id = req.params.id
//   const result = getUserById.get(id)

//   if (result) {
//     deleteUser.run(id)
//     res.send({ message: 'User deleted successfully.' })
//   } else {
//     res.status(404).send({ error: 'User does not exist.' })
//   }
// })

app.delete('/users/:id', (req, res) => {
  const id = req.params.id
  const result = deleteUser.run(id)

  console.log('result:', result)

  if (result.changes !== 0) {
    res.send({ message: 'User deleted successfully.' })
  } else {
    res.status(404).send({ error: 'User does not exist.' })
  }
})

app.listen(4000, () => {
  console.log(`Server up: http://localhost:4000`)
})
