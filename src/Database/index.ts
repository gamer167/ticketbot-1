import { MongoClient, Db } from 'mongodb';
import Tickets from './tables/Tickets';
import GrafanaAccounts from './tables/GrafanaAccounts';
import Recipients from './tables/Recipients';
import { config } from '../';
import rethinkdbdash, { ReqlClient } from 'rethinkdbdash';

export default class Database {
  private db: Db;

  public r: ReqlClient;

  public tickets: Tickets;
  public recipients: Recipients;
  public grafanaAccounts: GrafanaAccounts;

  public async bootstrap(): Promise<void> {
    this.r = rethinkdbdash({
      host: config.keys.dbServerHost,
      password: config.keys.rethink
    });

    const dbConn = await MongoClient.connect(config.keys.mongo, {
      useUnifiedTopology: true
    });
    this.db = dbConn.db();
    this.tickets = new Tickets(this.db.collection('tickets'));
    this.grafanaAccounts = new GrafanaAccounts(this.db.collection('grafana_accounts'));
    this.recipients = new Recipients(this.db.collection('recipients'));
  }
}
