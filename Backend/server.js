const http = require('http');
const app = require('./app'); // Import Express app

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
