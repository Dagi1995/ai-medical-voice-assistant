import { Client } from 'pg';
import { io } from './socket';
import { db } from '../config/db';
import { usersTable, sessionsChatTable } from '../config/schema';
import { sql } from 'drizzle-orm';

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
      await this.client.end().catch(() => { });
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

    this.client.on('notification', async (msg) => {
      console.log(`[DB Notification] Channel: ${msg.channel}`);

      try {
        // Handle Socket mapping
        if (msg.channel === 'user_update') {
          const users = await db.select().from(usersTable);
          io.emit('user:update', users);
          console.log(`Socket Emitted: 'user:update' with ${users.length} users`);
        } else if (msg.channel === 'appointment_update') {
          const appointments = await db.select().from(sessionsChatTable).orderBy(sql`${sessionsChatTable.id} DESC`);
          io.emit('appointment:update', appointments);
          console.log(`Socket Emitted: 'appointment:update' with ${appointments.length} records`);
        } else if (msg.channel === 'notification_update') {
          const { notificationsTable } = await import('../config/schema');
          const notifications = await db.select().from(notificationsTable).orderBy(sql`${notificationsTable.id} DESC`);
          io.emit('notification:update', notifications);
          console.log(`Socket Emitted: 'notification:update' with ${notifications.length} records`);
        }

        if (msg.payload) {
          const payload = JSON.parse(msg.payload);
          console.log(`Payload:`, payload);
        }
      } catch (err: any) {
        console.error('Error handling DB notification:', err.message);
      }
    });

    try {
      await this.client.connect();
      console.log('Connected to PostgreSQL for LISTEN/NOTIFY.');

      // Start listening to the required channels
      await this.client.query('LISTEN user_update');
      await this.client.query('LISTEN appointment_update');
      await this.client.query('LISTEN notification_update');

      console.log('Listening to channels: "user_update", "appointment_update", "notification_update"');

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
