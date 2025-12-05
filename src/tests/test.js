import test from 'node:test'
import assert from 'assert/strict'
import * as db from '../db/index.js'
import * as server from '../server.js'

test('Test Database Initialization', async () => {
  const db_name = ':memory:'
  const result = await db.init(db_name)
  assert.equal(result, `Database ${db_name} Initialized`)
})

test('Test Add Valid User', async () => {
  const result = await db.addUser("John", "Doe", "jondoe", "example@email.com", "1234567890", "Password")
  assert.equal(result, "User Added")
})

test('Test Valid Username Login', async () => {
  const result = await db.userLogin("jondoe", "Password")
  assert.equal(result, "Login Success")
})

test('Test Valid Phone Login', async () => {
  const result = await db.userLogin("1234567890", "Password")
  assert.equal(result, "Login Success")
})

test('Test Valid Email Login', async () => {
  const result = await db.userLogin("example@email.com", "Password")
  assert.equal(result, "Login Success")
})

test('Test Wrong Password Login', async () => {
  const result = await db.userLogin("jondoe", "WrongPassword")
  assert.equal(result, "Invalid Password")
})

test('Test Invalid Username Login', async () => {
  const result = await db.userLogin("notjondoe", "Password")
  assert.equal(result, "Invalid User")
})

test('Test Invalid Phone Login', async () => {
  const result = await db.userLogin("0987654321", "Password")
  assert.equal(result, "Invalid User")
})

test('Test Invalid Email Login', async () => {
  const result = await db.userLogin("invalid@email.com", "Password")
  assert.equal(result, "Invalid User")
})

test('Test No Input', async () => {
  const result = await db.userLogin()
  assert.equal(result, "Invalid Input")
})

test('Test One Input', async () => {
  const result = await db.userLogin("jondoe")
  assert.equal(result, "Invalid Input")
})

test('Test Server Start', async () => {
  const port = 8080
  const result = await server.init(port)
  assert.equal(result, `Server started on 127.0.0.1:${port}`)
})

test('Test Server Stop', async () => {
  const result = await server.close()
  assert.equal(result, "Server closed")
})
