/**
 * WebSocket connection hook with auto-reconnect capability
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_CONFIG } from '@/lib/constants';
import type { WebSocketMessage, DashboardData } from '@/types';

interface UseWebSocketOptions {
  url?: string;
  maxRetries?: number;
  retryDelay?: number;
  onMessage?: (data: DashboardData) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  url = WS_CONFIG.url,
  maxRetries = WS_CONFIG.maxReconnectAttempts,
  retryDelay = WS_CONFIG.reconnectDelay,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout>();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }
  }, []);

  const setupHeartbeat = useCallback(() => {
    clearHeartbeat();

    heartbeatTimeoutRef.current = setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Failed to send heartbeat:', error);
        }
      }
    }, WS_CONFIG.heartbeatInterval);
  }, [clearHeartbeat]);

  const connect = useCallback(() => {
    if (isConnecting || isConnected) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectCountRef.current = 0;
        setupHeartbeat();
        onConnect?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'update' || message.type === 'initial') {
            onMessage?.(message.data);
          } else if (message.type === 'error') {
            setError(message.message || 'Unknown error');
            onError?.(message.message || 'Unknown error');
          }

          // Reset heartbeat on any message
          setupHeartbeat();
        } catch (parseError) {
          console.error('Failed to parse WebSocket message:', parseError);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        const errorMessage = 'WebSocket connection error';
        setError(errorMessage);
        onError?.(errorMessage);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        clearHeartbeat();
        onDisconnect?.();

        // Attempt to reconnect
        if (reconnectCountRef.current < maxRetries) {
          reconnectCountRef.current++;
          const backoffDelay = retryDelay * Math.pow(1.5, reconnectCountRef.current - 1);

          console.log(
            `Reconnecting in ${backoffDelay}ms (attempt ${reconnectCountRef.current}/${maxRetries})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoffDelay);
        } else {
          const finalErrorMessage = 'Max reconnection attempts reached';
          setError(finalErrorMessage);
          onError?.(finalErrorMessage);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsConnecting(false);
    }
  }, [url, maxRetries, retryDelay, isConnecting, isConnected, onMessage, onError, onConnect, onDisconnect, setupHeartbeat, clearHeartbeat]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    clearHeartbeat();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectCountRef.current = 0;
  }, [clearHeartbeat]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(data));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        setError(errorMessage);
      }
    } else {
      const errorMessage = 'WebSocket is not connected';
      setError(errorMessage);
    }
  }, []);

  const subscribe = useCallback(
    (channel: string) => {
      send({
        type: 'subscribe',
        channel,
      });
    },
    [send]
  );

  const unsubscribe = useCallback(
    (channel: string) => {
      send({
        type: 'unsubscribe',
        channel,
      });
    },
    [send]
  );

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    send,
    subscribe,
    unsubscribe,
    disconnect,
    reconnect: connect,
  };
}
