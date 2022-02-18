import Database from 'better-sqlite3'

const db = new Database('./data.db', {
  verbose: console.log
})

const users = [
  { name: 'Denis' },
  { name: 'Rinor' },
  { name: 'Arita' },
  { name: 'Desintila' },
  { name: 'Artiola' },
  { name: 'Geri' }
]

const pets = [
  { name: 'Fluffy' },
  { name: 'Floofy' },
  { name: 'Fleefy' },
  { name: 'Flehfy' },
  { name: 'Lassie' }
]

const dropUsersTable = db.prepare('DROP TABLE users;')
dropUsersTable.run()

const dropPetsTable = db.prepare('DROP TABLE pets;')
dropPetsTable.run()

const createUsers = db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER,
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);
`)

createUsers.run()

const createPets = db.prepare(`
CREATE TABLE IF NOT EXISTS pets (
  id INTEGER,
  name TEXT NOT NULL,
  ownerId INTEGER,
  PRIMARY KEY (id)
);
`)

createPets.run()

const createUser = db.prepare(`
INSERT INTO users (name) VALUES (?);
`)

const deleteAllUsers = db.prepare(`
DELETE FROM users;
`)

const deleteUser = db.prepare(`
DELETE FROM users WHERE id=?;
`)

const updateUser = db.prepare(`
UPDATE users SET name=? WHERE id=?;
`)

const createPet = db.prepare(`
INSERT INTO pets (name, ownerId) VALUES (?, ?);
`)

const deleteAllPets = db.prepare(`
DELETE FROM pets;
`)

deleteAllUsers.run()
deleteAllPets.run()

for (const user of users) {
  createUser.run(user.name)
}

for (const pet of pets) {
  // @ts-ignore
  createPet.run(pet.name, pet.ownerId)
}
