"use server";

/**** Imports ****/
import { db } from "./database";
import { EpiObject, EpiQuery } from "@/types/epi";

const table = "EPIs";

/**
 * Crée un nouvel enregistrement dans la table EPIs.
 * @param args - Les données à insérer.
 * @returns `true` si l'insertion réussit, sinon `false`.
 */
export async function createEpi(args: EpiObject): Promise<boolean> {
  try {
    await db.newRecord(
      table,
      Object.keys(args),
      Object.values(args)
    );
    return true;
  } catch (e) {
    console.error("Erreur lors de la création :", e);
    throw e;
  }
}

/**
 * Récupère des enregistrements de la table EPIs en fonction des critères de recherche.
 * @param args - Les critères de recherche.
 * @returns Un tableau d'objets `EpiObject`.
 */
export async function readEpis(args: EpiQuery): Promise<EpiObject[]> {
  try {
    return await db.readRecords(table, args);
  } catch (e) {
    console.error("Erreur lors de la lecture :", e);
    throw e;
  }
}

/**
 * Met à jour un enregistrement dans la table EPIs.
 * @param args - Les nouvelles valeurs.
 * @param Id - La clé primaire pour identifier l'enregistrement.
 * @returns L'enregistrement mis à jour.
 */
export async function updateEpi(args: EpiObject, Id: string): Promise<EpiObject> {
  try {
    await db.updateRecord(
      table,
      Object.keys(args),
      Object.values(args),
      "Id",
      Id
    );
    return args;
  } catch (e) {
    console.error("Erreur lors de la mise à jour :", e);
    throw e;
  }
}

/**
 * Supprime un enregistrement de la table EPIs.
 * @param Id - La clé primaire pour identifier l'enregistrement.
 * @returns L'enregistrement supprimé.
 */
export async function deleteEpi(Id: number): Promise<boolean> {
  try {
    await db.deleteRecord(table, "Id", Id);
    return true;
  } catch (e) {
    console.error("Erreur lors de la suppression :", e);
    throw e;
  }
}
