"use server";

/**** Imports ****/
import { pool, db } from "./database";
import { EpitypesObject, EpitypesQuery } from "@/types/epiType";

const table = "EPITypes";

/**
 * Crée un nouvel enregistrement dans la table EPITypes.
 * @param args - Les données à insérer.
 * @returns `true` si l'insertion réussit, sinon `false`.
 */
export async function createEpiType(args: EpitypesObject): Promise<boolean> {
  try {
    await db.newRecord(
      table,
      ["wordingEn", "wordingFr", "controlGap"],
      [args.wordingEn, args.wordingFr, args.controlGap]
    );
    return true;
  } catch (e) {
    console.error("Erreur lors de la création :", e);
    throw new Error("Erreur lors de la création de l'enregistrement");
  }
}

/**
 * Récupère des enregistrements de la table EPITypes en fonction des critères de recherche.
 * @param args - Les critères de recherche.
 * @returns Un tableau d'objets `EpitypesObject`.
 */
export async function readEpiTypes(args: EpitypesQuery): Promise<EpitypesObject[]> {
  let where: string = " ";
  let values: any[] = [];

  if (args.wordingEn) {
    where += "wordingEn = ? ";
    values.push(args.wordingEn);
  }
  if (args.wordingFr) {
    where += "wordingFr = ? ";
    values.push(args.wordingFr);
  }
  if (args.controlGap) {
    where += "controlGap = ? ";
    values.push(args.controlGap);
  }

  let conn;
  let rows: EpitypesObject[] = [];

  try {
    conn = await pool.getConnection();
    rows = await conn.query(`SELECT * FROM ${table}${where}`, values);
  } catch (e) {
    console.error("Erreur lors de la lecture :", e);
    throw new Error("Erreur lors de la récupération des enregistrements");
  } finally {
    if (conn) conn.release();
  }

  return rows;
}

/**
 * Met à jour un enregistrement dans la table EPITypes.
 * @param args - Les nouvelles valeurs.
 * @param wordingEn - La clé primaire pour identifier l'enregistrement.
 * @returns L'enregistrement mis à jour.
 */
export async function updateEpiType(
  args: EpitypesQuery,
  wordingEn?: string | null
): Promise<EpitypesObject> {
  let set: string = " ";
  let values: any[] = [];

  if (args.wordingFr) {
    set += "wordingFr = ? ";
    values.push(args.wordingFr);
  }
  if (args.controlGap) {
    set += "controlGap = ? ";
    values.push(args.controlGap);
  }

  if (!wordingEn && !args.wordingEn) {
    throw new Error("Erreur : wordingEn est requis pour la mise à jour");
  }
  values.push(wordingEn || args.wordingEn);

  let conn;
  let rows: EpitypesObject[] = [];

  try {
    conn = await pool.getConnection();
    rows = await conn.query(`UPDATE ${table} SET ${set} WHERE wordingEn = ?`, values);
  } catch (e) {
    console.error("Erreur lors de la mise à jour :", e);
    throw new Error("Erreur lors de la mise à jour de l'enregistrement");
  } finally {
    if (conn) conn.release();
  }

  return rows[0];
}

/**
 * Supprime un enregistrement de la table EPITypes.
 * @param wordingEn - La clé primaire pour identifier l'enregistrement.
 * @returns L'enregistrement supprimé.
 */
export async function deleteEpiType(wordingEn?: string | null): Promise<EpitypesObject> {
  let values: any[] = [wordingEn];

  let conn;
  let rows: EpitypesObject[] = [];

  try {
    conn = await pool.getConnection();
    rows = await conn.query(`DELETE FROM ${table} WHERE wordingEn = ?`, values);
  } catch (e) {
    console.error("Erreur lors de la suppression :", e);
    throw new Error("Erreur lors de la suppression de l'enregistrement");
  } finally {
    if (conn) conn.release();
  }

  return rows[0];
}