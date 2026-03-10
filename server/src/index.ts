/**
 * Real-Time Analytics Dashboard Server
 * WebSocket server for streaming analytics data to connected clients
 * Built with Express.js and ws library
 */

import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketHandler } from './websocket';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Server status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'running',
    wsClients: wsHandler.getClientCount(),
    timestamp: new Date().toISOString(),
  });
});

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket handler
const wsHandler = new WebSocketHandler(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  wsHandler.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  wsHandler.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Real-Time Analytics Dashboard Server                     ║
║  Running on http://localhost:${PORT}${PORT.toString().length === 4 ? ' ' : ''}                            ║
║  WebSocket: ws://localhost:${PORT}/ws${PORT.toString().length === 4 ? ' ' : ''}                     ║
║  Frontend: ${FRONTEND_URL.padEnd(46)}║
╚════════════════════════════════════════════════════════════╝
  `);
});
