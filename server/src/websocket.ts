/**
 * WebSocket handler for real-time dashboard updates
 * Manages client connections and broadcasts analytics data updates
 */

import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { dataGenerator } from './data-generator';

interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'ping';
  channel?: string;
}

interface DashboardUpdate {
  type: 'update';
  data: any;
  timestamp: number;
}

export class WebSocketHandler {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private updateInterval: NodeJS.Timeout | null = null;
  private currentData: any;
  private updateFrequency: number = 2000; // 2 seconds

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.currentData = dataGenerator.generate();
    this.setupConnections();
    this.startBroadcasting();
  }

  /**
   * Setup WebSocket connection handlers
   */
  private setupConnections(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log(`Client connected. Total clients: ${this.clients.size + 1}`);
      this.clients.add(ws);

      // Send initial data to new client
      this.sendToClient(ws, {
        type: 'initial',
        data: this.currentData,
        timestamp: Date.now(),
      });

      // Handle incoming messages
      ws.on('message', (message: string) => {
        try {
          const parsedMessage: WebSocketMessage = JSON.parse(message);
          this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          this.sendToClient(ws, {
            type: 'error',
            message: 'Invalid message format',
            timestamp: Date.now(),
          });
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`Client disconnected. Total clients: ${this.clients.size}`);
      });

      // Handle errors
      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Handle pong responses for health checks
      ws.on('pong', () => {
        // Client is alive
      });
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(ws: WebSocket, message: WebSocketMessage): void {
    switch (message.type) {
      case 'subscribe':
        this.sendToClient(ws, {
          type: 'subscribed',
          channel: message.channel || 'dashboard',
          timestamp: Date.now(),
        });
        break;

      case 'unsubscribe':
        this.sendToClient(ws, {
          type: 'unsubscribed',
          channel: message.channel || 'dashboard',
          timestamp: Date.now(),
        });
        break;

      case 'ping':
        this.sendToClient(ws, {
          type: 'pong',
          timestamp: Date.now(),
        });
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message to client:', error);
      }
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcast(message: any): void {
    const serializedMessage = JSON.stringify(message);

    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(serializedMessage);
        } catch (error) {
          console.error('Failed to broadcast to client:', error);
          this.clients.delete(ws);
        }
      }
    });
  }

  /**
   * Start broadcasting real-time updates to all clients
   */
  private startBroadcasting(): void {
    this.updateInterval = setInterval(() => {
      // Update data
      dataGenerator.updateRealtimeMetrics(this.currentData);

      // Broadcast to all clients
      this.broadcast({
        type: 'update',
        data: this.currentData,
        timestamp: Date.now(),
        clientCount: this.clients.size,
      } as DashboardUpdate);
    }, this.updateFrequency);
  }

  /**
   * Stop broadcasting
   */
  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Close all client connections
    this.clients.forEach((ws) => {
      ws.close(1000, 'Server shutting down');
    });

    this.clients.clear();
    this.wss.close();
  }

  /**
   * Get number of connected clients
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Set update frequency in milliseconds (1000-5000 recommended)
   */
  public setUpdateFrequency(frequency: number): void {
    if (frequency < 1000 || frequency > 5000) {
      console.warn('Update frequency should be between 1000-5000ms');
      return;
    }

    this.updateFrequency = frequency;

    // Restart broadcasting with new frequency
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.startBroadcasting();
  }
}
