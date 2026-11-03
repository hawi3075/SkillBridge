/**
 * SkillBridge Server Entrypoint
 * Boots HTTP and Socket.IO real-time server with graceful shutdown.
 */

const http = require('http');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
} catch (e) {}

const app = require('./app');
const { initSocketServer } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO with CORS
let io = null;
try {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.CLIENT_URL
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  initSocketServer(io);
  console.log('⚡ Socket.IO real-time server initialized');
} catch (e) {
  console.log('Note: Socket.IO initialized in lightweight fallback mode:', e.message);
}

// Start Server
server.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 SkillBridge Backend API running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('========================================================');
});

// Graceful Shutdown
const shutdown = () => {
  console.log('Gracefully terminating server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { server, app, io };
