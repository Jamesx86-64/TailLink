import pkg from 'pg'
import crypto from 'crypto'

const { Client } = pkg

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'james', // TODO change
  database: 'TailLinkDB',
})

export async function init() {
  try {
    await client.connect()

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS citext;
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name CITEXT,
        last_name CITEXT,
        username CITEXT UNIQUE NOT NULL,
        email CITEXT UNIQUE,
        phone CITEXT UNIQUE,
        password_hash VARCHAR(128) NOT NULL,
        password_salt VARCHAR(32) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS shelters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE,
        username VARCHAR(50) UNIQUE NOT NULL,
        address VARCHAR(255) UNIQUE,
        phone CITEXT UNIQUE,
        email VARCHAR(100) UNIQUE,
        website VARCHAR(100) UNIQUE
      );
      CREATE TABLE IF NOT EXISTS animals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100),
        species VARCHAR(50),
        breed VARCHAR(100),
        age INT,
        shelter_id INT REFERENCES shelters(id)
      );
    `)
  } catch (err) {
    console.error('Error:', err)
  }
}

export async function addUser(first_name, last_name, username, email, phone, password) {
  try {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')

    await client.query(`
      INSERT INTO users (first_name, last_name, username, email, phone, password_hash, password_salt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [first_name, last_name, username, email, phone, hash, salt])

    return "Success"
  } catch (err) {
    console.error('Error:', err)
  }
}

export async function addShelters(name, address, phone, email, website) {
  try {
    await client.query(`
      INSERT INTO shelters (name, address, phone, email, website)
      VALUES ($1, $2, $3, $4, $5)
    `, [name, address, phone, email, website])
  } catch (err) {
    console.error('Error:', err)
  }
}

export async function addAnimal(name, species, breed, age, shelter_id) {
  try {
    await client.query(`
      INSERT INTO animals (name, species, breed, age, shelter_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [name, species, breed, age, shelter_id])
  } catch (err) {
    console.error('Error:', err)
  }
}

export async function userLogin(login, password) {
  try {
    if (!login || !password) {
      return "Invalid Input"
    }
    const result = await client.query(`
      SELECT id, password_hash, password_salt 
      FROM users 
      WHERE username = $1 OR email = $1 OR phone = $1
      LIMIT 1;
    `, [login])

    if (result.rows[0]) {
      if (crypto.scryptSync(password, result.rows[0].password_salt, 64).toString('hex') == result.rows[0].password_hash)
        return "Login Success"
      else
        return "Invalid Password"
    }
    else {
      return "Invalid User"
    }
  } catch (err) {
    console.error('Error:', err)
  }
}