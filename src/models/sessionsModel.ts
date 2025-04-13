"use server";

/**** Imports ****/
import { pool, db } from "./database";
import { SessionObject, SessionQuery, SessionCreation } from "@/types/session";
import {v4 as uuidv4} from 'uuid';

const table = "sessions";

/**
 * Creates a new session record in the sessions table.
 * @param args - The session data to insert.
 * @returns The GUID of the newly created session if successful, otherwise null.
 */
export async function createSession(args: SessionCreation): Promise<string | null> {
    const now = new Date().toISOString().split('T')[0]
  try {
    const result = await db.newRecord(
        table,
      [`GUID`, `userConcerned`, `lastActionDateTime`, `creationDateTime`],
      [uuidv4(),args.userConcerned,now,now]
    );
    
    return result[0]['GUID'];
  } catch (e) {
    console.error("Error creating session:", e);
    throw new Error("Error creating session record");
  }
}

/**
 * Retrieves session records from the sessions table based on search criteria.
 * @param args - The search criteria.
 * @returns An array of SessionObject.
 */
export async function readSessions(args: SessionQuery): Promise<SessionObject[]> {
  let where: string = "";
  let values: any[] = [];
  let whereConditions: string[] = [];

  if (args.GUID) {
    whereConditions.push("GUID = ?");
    values.push(args.GUID);
  }
  if (args.userConcerned) {
    whereConditions.push("userConcerned = ?");
    values.push(args.userConcerned);
  }

  if (whereConditions.length > 0) {
    where = " WHERE " + whereConditions.join(" AND ");
  }

  let conn;
  let rows: SessionObject[] = [];

  try {
    conn = await pool.getConnection();
    rows = await conn.query(`SELECT * FROM ${table}${where}`, values);
    
    // Convert string dates to Date objects
    rows = rows.map(row => ({
      ...row,
      lastActionDateTime: new Date(row.lastActionDateTime),
      creationDateTime: new Date(row.creationDateTime)
    }));
  } catch (e) {
    console.error("Error reading sessions:", e);
    throw new Error("Error retrieving session records");
  } finally {
    if (conn) conn.release();
  }

  return rows;
}

/**
 * Updates a session record in the sessions table.
 * @param args - The new values to update.
 * @param GUID - The primary key to identify the record.
 * @returns The updated session record.
 */
export async function updateSession(
  args: SessionQuery,
  GUID?: string | null
): Promise<SessionObject> {
  let setStatements: string[] = [];
  let values: any[] = [];

  // Always update lastActionDateTime when updating a session
  setStatements.push("lastActionDateTime = NOW()");

  if (args.userConcerned) {
    setStatements.push("userConcerned = ?");
    values.push(args.userConcerned);
  }

  if (!GUID && !args.GUID) {
    throw new Error("Error: GUID is required for update");
  }
  
  const targetGUID = GUID || args.GUID;
  values.push(targetGUID);

  let conn;
  let result: SessionObject;

  try {
    conn = await pool.getConnection();
    await conn.query(
      `UPDATE ${table} SET ${setStatements.join(", ")} WHERE GUID = ?`,
      values
    );
    
    // Get and return the updated record
    const updated = await conn.query(`SELECT * FROM ${table} WHERE GUID = ?`, [targetGUID]);
    
    if (updated.length === 0) {
      throw new Error("No session record found with the specified GUID");
    }
    
    result = {
      ...updated[0],
      lastActionDateTime: new Date(updated[0].lastActionDateTime),
      creationDateTime: new Date(updated[0].creationDateTime)
    };
  } catch (e) {
    console.error("Error updating session:", e);
    throw new Error("Error updating session record");
  } finally {
    if (conn) conn.release();
  }

  return result;
}

/**
 * Deletes a session record from the sessions table.
 * @param GUID - The primary key to identify the record.
 * @returns True if deletion was successful.
 */
export async function deleteSession(GUID: string): Promise<boolean> {
  if (!GUID) {
    throw new Error("Error: GUID is required for deletion");
  }

  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(`DELETE FROM ${table} WHERE GUID = ?`, [GUID]);
    return true;
  } catch (e) {
    console.error("Error deleting session:", e);
    throw new Error("Error deleting session record");
  } finally {
    if (conn) conn.release();
  }
}