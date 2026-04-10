import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

class DatabaseListener {
  private client: Client | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;

  constructor() {
    if (!connectionString) {
      console.warn('DATABASE_URL is not set. DatabaseListener will not start.');
      return;
    }
    this.connect();
  }

  private async connect() {
    if (this.isShuttingDown) return;

    if (this.client) {
      await this.client.end().catch(() => {});
    }

    this.client = new Client({
      connectionString,
    });

    this.client.on('error', (err) => {
      console.error('PostgreSQL LISTEN client error:', err.message);
      this.scheduleReconnect();
    });

    this.client.on('end', () => {
      console.warn('PostgreSQL LISTEN client disconnected.');
      this.scheduleReconnect();
    });

    this.client.on('notification', (msg) => {
      console.log(`[DB Notification] Channel: ${msg.channel}`);
      if (msg.payload) {
        try {
          const payload = JSON.parse(msg.payload);
          console.log(`Payload:`, payload);
        } catch (e) {
          console.log(`Payload (Raw):`, msg.payload);
        }
      }
    });

    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL for LISTEN/NOTIFY.');
      
      // Start listening to the required channels
      await this.client.query('LISTEN user_update');
      await this.client.query('LISTEN appointment_update');
      
      console.log('Listening to channels: "user_update", "appointment_update"');
      
      // Clear any pending reconnects
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    } catch (error: any) {
      console.error('Failed to connect to PostgreSQL:', error.message);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.isShuttingDown || this.reconnectTimeout) return;
    
    console.log(`Attempting to reconnect in ${this.reconnectInterval / 1000}s...`);
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, this.reconnectInterval);
  }

  public async close() {
    this.isShuttingDown = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }
}

const dbListener = new DatabaseListener();

export default dbListener;
