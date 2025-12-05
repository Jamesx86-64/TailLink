import Database from 'better-sqlite3'
import crypto from 'crypto'

let db

export function init(dbName = 'app.db') {
  db = new Database(dbName)

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL
    )
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS shelters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      username TEXT UNIQUE NOT NULL,
      address TEXT UNIQUE,
      phone TEXT UNIQUE,
      email TEXT UNIQUE,
      website TEXT UNIQUE
    )
  `).run()

  db.prepare(`
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      species TEXT,
      breed TEXT,
      age INTEGER,
      shelter_id INTEGER REFERENCES shelters(id)
    )
  `).run()

  return `Database ${dbName} Initialized`
}

export function addUser(first_name, last_name, username, email, phone, password) {
  try {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')

    db.prepare(`
      INSERT INTO users (first_name, last_name, username, email, phone, password_hash, password_salt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, username, email, phone, hash, salt)

    return "User Added"
  } catch (err) {
    console.error('Error:', err)
    return "Error Adding User"
  }
}

export function addShelter(name, username, address, phone, email, website) {
  try {
    db.prepare(`
      INSERT INTO shelters (name, username, address, phone, email, website)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, username, address, phone, email, website)

    return "Shelter Added"
  } catch (err) {
    console.error('Error:', err)
    return "Error Adding Shelter"
  }
}

export function addAnimal(name, species, breed, age, shelter_id) {
  try {
    db.prepare(`
      INSERT INTO animals (name, species, breed, age, shelter_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, species, breed, age, shelter_id)

    return "Animal Added"
  } catch (err) {
    console.error('Error:', err)
    return "Error Adding Animal"
  }
}

export function userLogin(login, password) {
  try {
    if (!login || !password) return "Invalid Input"

    const row = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?
    `).get(login, login, login)

    if (!row) return "Invalid User"

    const hash = crypto.scryptSync(password, row.password_salt, 64).toString('hex')
    return hash === row.password_hash ? "Login Success" : "Invalid Password"

  } catch (err) {
    console.error('Error:', err)
    return "Error Logging In"
  }
}

