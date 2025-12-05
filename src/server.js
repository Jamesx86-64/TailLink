import http from 'http'
import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db/index.js'

let indexFile
let styleFile

indexFile = await fs.readFile(path.dirname(fileURLToPath(import.meta.url)) + '/public/index.html')
styleFile = await fs.readFile(path.dirname(fileURLToPath(import.meta.url)) + '/public/style.css')

const requestListener = async function (req, res) {
  switch (req.url) {
    case "/style.css":
      res.writeHead(200, { 'Content-Type': 'text/css' })
      res.end(styleFile)
      break
    default:
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(indexFile)
  }
}

const server = http.createServer(requestListener)

export async function init(port = 8080) {
  return new Promise((resolve) => {
    server.listen(port, () => {
      const msg = `Server started on 127.0.0.1:${port}`
      console.log(msg)
      resolve(msg)
    })
  })
}
