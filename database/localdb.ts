import { Drug } from '@/redux/features/drug/drug';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite'
export const getDBConnection = async () => {
    return await openDatabaseAsync("drug.db");
};

export type TempDrug = {
    id: number,
    type: number,
    drug?: Drug
}

export const createTable = async (db: SQLiteDatabase) => {
    const exists = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='Drug';`);
    if (exists.length > 0) {
        return;
    }
    const query = `CREATE TABLE IF NOT EXISTS Drug (
        id INTEGER PRIMARY KEY,
        name TEXT,
        category TEXT,
        price REAL,
        numberOfUnits INTEGER,
        manufacturer TEXT
    );`;
    await db.runAsync(query);
    const tempTable = `CREATE TABLE IF NOT EXISTS TempDrug (
        id INTEGER,
        type INTEGER);`;
    await db.runAsync(tempTable);
};

export const insertDrug = async (db: SQLiteDatabase, drug: Drug) => {
    const query = `INSERT INTO Drug (${drug.id !== -1 ? "id," : ""} name, category, price, numberOfUnits, manufacturer) VALUES (${drug.id !== -1 ? "?," : ""} ?, ?, ?, ?, ?);`;
    const values = [drug.name, drug.category, drug.price, drug.numberOfUnits, drug.manufacturer];
    if (drug.id !== -1) {
        values.unshift(drug.id);
    }
    const response = await db.runAsync(query, values);
    console.log("Inserted into local db");
    return response.lastInsertRowId;
}

export const getDrugs = async (db: SQLiteDatabase) => {
    const query = `SELECT * FROM Drug;`;
    const response = await db.getAllAsync(query);
    const drugs: Drug[] = [];
    for (let i = 0; i < response.length; i++) {
        drugs.push(response[i] as Drug);
    }
    return drugs;
}

export const getDrug = async (db: SQLiteDatabase, id: number) => {
    const query = `SELECT * FROM Drug WHERE id = ?;`;
    const values = [id];
    const response = await db.getFirstAsync(query, values);
    return response as Drug;
}

export const editDrug = async (db: SQLiteDatabase, drug: Drug) => {
    const query = `UPDATE Drug SET name = ?, category = ?, price = ?, numberOfUnits = ?, manufacturer = ? WHERE id = ?;`;
    const values = [drug.name, drug.category, drug.price, drug.numberOfUnits, drug.manufacturer, drug.id];
    await db.runAsync(query, values);
}

export const deleteDrug = async (db: SQLiteDatabase, id: number) => {
    const query = `DELETE FROM Drug WHERE id = ?;`;
    const values = [id];
    await db.runAsync(query, values);
    console.log("Deleted from local db");
}

export const rehydrateLocalDB = async (drugs: Drug[]) => {
    const db = await getDBConnection();
    await db.runAsync(`DELETE FROM Drug;`);
    for (let i = 0; i < drugs.length; i++) {
        await insertDrug(db, drugs[i]);
    }
}


export const initDB = async () => {
    const db = await getDBConnection();
    await createTable(db);
    return db;
}

export const insertTempDrug = async (db: SQLiteDatabase, tempDrug: TempDrug) => {
    console.log("Inserting temp drug");
    console.log(tempDrug);
    const query = `INSERT INTO TempDrug (id, type) VALUES (?, ?);`;
    const values = [tempDrug.id, tempDrug.type];
    await db.runAsync(query, values);
}

export const getTempDrugs = async (db: SQLiteDatabase) => {
    const query = `SELECT Drug.*, TempDrug.id, TempDrug.type FROM TempDrug LEFT JOIN Drug ON TempDrug.id = Drug.id;`;
    const response = await db.getAllAsync(query);
    const tempDrugs: TempDrug[] = [];
    for (let i = 0; i < response.length; i++) {
        const responseDrug = response[i] as any;
        const tempDrug = {
            id: responseDrug.id,
            type: responseDrug.type,
            drug: responseDrug.name ? {
                id: responseDrug.id,
                name: responseDrug.name,
                category: responseDrug.category,
                price: responseDrug.price,
                numberOfUnits: responseDrug.numberOfUnits,
                manufacturer: responseDrug.manufacturer
            }
                : undefined
        }
        tempDrugs.push(tempDrug);
    }
    return tempDrugs;
}

export const deleteTempDrug = async (db: SQLiteDatabase) => {
    const query = `DELETE FROM TempDrug`;
    await db.runAsync(query);
}