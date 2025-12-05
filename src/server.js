import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const app = express();
const server = http.createServer(app);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(publicDir, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(publicDir, "signup.html"));
});

let serverInstance = null;

export async function init(port = 8080) {
  server.on("connection", (socket) => {
    console.log("[TCP] New connection from", socket.remoteAddress);
  });
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url} from ${req.ip}`);
    next();
  });
  return new Promise((resolve) => {
    serverInstance = server.listen(port, () => {
      resolve(`Server started on 127.0.0.1:${port}`);
    });
  });
}

export function close() {
  return new Promise((resolve, reject) => {
    if (!serverInstance) return resolve("Server not running");
    serverInstance.close((err) => {
      if (err) reject(err);
      else resolve("Server closed");
    });
  });
}