// Middleware for GET /events endpoint


let clients = [];
let nests = [];

// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newNest) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newNest)}\n\n`))
}

module.exports.getStatus = function(req, res) { return res.json({clients: clients.length}) }

module.exports.eventsHandler = function (req, res, next) {
  // Mandatory headers and http status to keep connection open
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  // After client opens connection send all nests as string
  const data = `data: ${JSON.stringify(nests)}\n\n`;
  res.write(data);

  // Generate an id based on timestamp and save res
  // object of client connection on clients list
  // Later we'll iterate it and send updates to each client
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
}

// Middleware for POST /nest endpoint
module.exports.addNest = async function(req, res, next) {
  const newNest = req.body;
  nests.push(newNest);

  // Send recently added nest as POST result
  res.json(newNest)

  // Invoke iterate and send function
  return sendEventsToAll(newNest);
}
