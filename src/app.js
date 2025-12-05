import * as db from './db/index.js'
import * as server from './server.js'

async function main() {
  console.log(await db.init())
  console.log(await server.init())
}

main()
