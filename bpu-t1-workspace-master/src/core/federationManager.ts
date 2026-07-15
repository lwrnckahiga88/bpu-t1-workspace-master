import { PeerNode } from "./types";

export class FederationManager {
  private peers: PeerNode[] = [];

  constructor() {
    // Initialize with mock data from the whitepaper
    this.peers = [
      {
        id: "peer-001",
        name: "Nairobi County Node",
        address: "192.168.1.101:3000",
        status: "online",
        lastSync: new Date(Date.now() - 60000),
        eventCount: 1247,
      },
      {
        id: "peer-002",
        name: "Kisumu County Node",
        address: "192.168.1.102:3000",
        status: "online",
        lastSync: new Date(Date.now() - 120000),
        eventCount: 892,
      },
    ];
  }

  listPeers(): PeerNode[] {
    return this.peers;
  }

  async broadcastMessage(message: string): Promise<{ status: string; peersReached: number; message: string; timestamp: string }> {
    // Simulate broadcast delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      status: "success",
      peersReached: this.peers.length,
      message: message,
      timestamp: new Date().toISOString(),
    };
  }

  // Method to update peer status/sync (for future use)
  updatePeerStatus(id: string, status: PeerNode["status"], lastSync: Date, eventCount: number) {
    const peer = this.peers.find((p) => p.id === id);
    if (peer) {
      peer.status = status;
      peer.lastSync = lastSync;
      peer.eventCount = eventCount;
    }
  }
}
