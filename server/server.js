const jsonServer = require("json-server");
const auth = require("json-server-auth");
const server = jsonServer.create();
const router = jsonServer.router("./server/db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// You must apply the auth middleware before the router
server.db = router.db;
server.use(auth);

// Use default router
server.use(router);

server.listen(3001, () => {
    console.log("JSON Server is running on port 3001");
});
