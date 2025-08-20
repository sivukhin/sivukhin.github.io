import { Database } from '@tursodatabase/database'

const db = new Database(':memory:');
await db.exec('CREATE TABLE t (x)');
await db.exec('INSERT INTO t VALUES (1)');
console.info(await (await db.prepare('SELECT * FROM t')).all());
