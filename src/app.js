import * as db from './db/index.js'
import * as server from './server.js'

async function main() { 
  db.init()
  server.init()
}

main()