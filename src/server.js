import http from 'http'
import fs from 'fs/promises'
import * as db from './db/index.js'

let indexFile
let styleFile

indexFile = await fs.readFile('./public/index.html')
styleFile = await fs.readFile('./public/style.css')

const requestListener = async function (req, res) {
  switch (req.url) {
    case "/style.css":
      res.writeHead(200, { 'Content-Type': 'text/css' })
      res.end(styleFile)
      break
    default:
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(indexFile)
      if (req.method === 'POST' && req.url === '/log') {
        req.on('data', async (chunk) => {
          console.log(await db.userLogin(
            JSON.parse(chunk.toString()).loginUserField, 
            JSON.parse(chunk.toString()).loginPasswordField
          ))
        })
      }
  }
}

const server = http.createServer(requestListener)

export async function init(port = 8080, host = 'localhost') {
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
}