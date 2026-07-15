export interface Adapter {
  connect(): Promise<any>;
  read(): Promise<any>;
  write(data: any): Promise<any>;
  health(): Promise<number>;
}

export interface Plugin {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  health: number;
  costPerCall: number;
  currency: string;
  lastCheck: Date;
}

export interface Transaction {
  id: string;
  pluginId: string;
  pluginName: string;
  method: 'read' | 'write' | 'health' | 'connect';
  cost: number;
  currency: string;
  timestamp: Date;
}

export interface PeerNode {
  id: string;
  name: string;
  address: string;
  status: 'online' | 'offline' | 'degraded';
  lastSync: Date;
  eventCount: number;
}

export interface RuntimeHealth {
  status: 'operational' | 'degraded' | 'offline';
  health: number;
  uptime: number;
  totalRequests: number;
  totalErrors: number;
}
