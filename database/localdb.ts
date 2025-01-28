import { Entity } from '@/redux/features/entity/entity';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite'
export const getDBConnection = async () => {
    return await openDatabaseAsync("entity.db");
};

export type TempEntity = {
    id: number,
    type: number,
    entity?: Entity
}

export const createTable = async (db: SQLiteDatabase) => {
    const exists = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='Transactions';`);
    console.log(exists);
    if (exists.length > 0) {
        console.log("Table already exists");
        return;
    }
    const query = `CREATE TABLE IF NOT EXISTS Transactions (
        id INTEGER PRIMARY KEY,
        date TEXT,
        amount REAL,
        type TEXT,
        category TEXT,
        description TEXT
    );`;
    console.log("Creating Transactions table");
    await db.runAsync(query);
    console.log("Created Transactions table");
    const tempTable = `CREATE TABLE IF NOT EXISTS TempTransactions (
        id INTEGER,
        type INTEGER);`;
    await db.runAsync(tempTable);
};

export const insertEntity = async (db: SQLiteDatabase, entity: Entity) => {
    const query = `INSERT INTO Transactions (${entity.id !== -1 ? "id," : ""} date, amount, type, category, description) VALUES (${entity.id !== -1 ? "?, " : ""} ?, ?, ?, ?, ?);`;
    const values = [entity.date, entity.amount, entity.type, entity.category, entity.description];
    if (entity.id !== -1) {
        values.unshift(entity.id);
    }
    const response = await db.runAsync(query, values);
    console.log("Inserted into local db");
    return response.lastInsertRowId;
}

export const getEntities = async (db: SQLiteDatabase) => {
    const query = `SELECT * FROM Transactions;`;
    const response = await db.getAllAsync(query);
    const entities: Entity[] = [];
    for (let i = 0; i < response.length; i++) {
        entities.push(response[i] as Entity);
    }
    return entities;
}

export const getEntity = async (db: SQLiteDatabase, id: number) => {
    const query = `SELECT * FROM Transactions WHERE id = ?;`;
    const values = [id];
    const response = await db.getFirstAsync(query, values);
    return response as Entity;
}

export const editEntity = async (db: SQLiteDatabase, entity: Entity) => {
    const query = `UPDATE Transactions SET date, amount, type, category, description WHERE id = ?;`;
    const values = [entity.date, entity.amount, entity.type, entity.category, entity.description, entity.id];
    await db.runAsync(query, values);
}

export const deleteEntity = async (db: SQLiteDatabase, id: number) => {
    const query = `DELETE FROM Transactions WHERE id = ?;`;
    const values = [id];
    await db.runAsync(query, values);
    console.log("Deleted from local db");
}

export const rehydrateLocalDB = async (entities: Entity[]) => {
    const db = await getDBConnection();
    await db.runAsync(`DELETE FROM Transactions;`);
    for (let i = 0; i < entities.length; i++) {
        await insertEntity(db, entities[i]);
    }
}

export const initDB = async () => {
    console.log("Initializing DB");
    const db = await getDBConnection();
    console.log("DB Connection established");
    await createTable(db);
    console.log("Table created");
    return db;
}

export const insertTempEntity = async (db: SQLiteDatabase, tempEntity: TempEntity) => {
    console.log("Inserting temp entity");
    console.log(tempEntity);
    const query = `INSERT INTO TempTransactions (id, type) VALUES (?, ?);`;
    const values = [tempEntity.id, tempEntity.type];
    await db.runAsync(query, values);
}

export const getTempEntities = async (db: SQLiteDatabase) => {
    const query = `SELECT Transactions.*, TempTransactions.id, TempTransactions.type FROM TempTransactions LEFT JOIN Transactions ON TempTransactions.id = Transactions.id;`;
    const response = await db.getAllAsync(query);
    const tempEntities: TempEntity[] = [];
    for (let i = 0; i < response.length; i++) {
        const responseEntity = response[i] as any;
        const tempEntity = {
            id: responseEntity.id,
            type: responseEntity.type,
            entity: responseEntity.date ? {
                id: responseEntity.id,
                date: responseEntity.date,
                amount: responseEntity.amount,
                type: responseEntity.type,
                category: responseEntity.category,
                description: responseEntity.description
            }
                : undefined
        }
        tempEntities.push(tempEntity);
    }
    return tempEntities;
}

export const deleteTempEntity = async (db: SQLiteDatabase) => {
    const query = `DELETE FROM TempTransactions`;
    await db.runAsync(query);
}