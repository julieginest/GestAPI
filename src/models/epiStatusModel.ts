"use server"
/**** Imports ****/
import { db } from "./database";
import { EpistatusObject, EpistatusQuery } from "@/types/epiStatus";

const table = "EPIStatus";

/**
 * Crée un nouvel enregistrement dans la table EPIStatus.
 * @param args - Les données de création de l'enregistrement.
 * @returns `true` si l'insertion réussit, sinon `false`.
 */
export async function createEpistatus(args: EpistatusObject): Promise<boolean> {
    try {
        await db.newRecord(
            table,
            Object.keys(args),
            Object.values(args)
        );
        return true;
    } catch (e) {
        console.error("Erreur lors de la création :", e);
        throw new Error("Erreur lors de la création de l'enregistrement");
    }
}

/**
 * Récupère des enregistrements de la table EPIStatus en fonction des critères de recherche.
 * @param args - Les critères de recherche.
 * @returns Un tableau d'objets `EpistatusObject`.
 */
export async function readEpistatus(args: EpistatusQuery): Promise<EpistatusObject[]> {
    try {
        return await db.readRecords(table, args);
      } catch (e) {
        console.error("Erreur lors de la lecture :", e);
        throw e;
      }
    
}

/**
 * Met à jour un enregistrement dans la table EPIStatus.
 * @param args - Les nouvelles valeurs de l'enregistrement.
 * @param wording - La clé primaire de l'enregistrement à mettre à jour.
 * @returns L'enregistrement mis à jour.
 */
export async function updateEpistatus(args: EpistatusQuery, wording: string): Promise<EpistatusObject> {
    if (!wording) throw new Error("Le wording est requis pour la mise à jour");

    let set: string[] = [];
    let values: any[] = [];

    Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined) {
            set.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (set.length === 0) throw new Error("Aucune donnée à mettre à jour");

    values.push(wording); // Ajout du wording à la fin des valeurs

    try {
        await db.updateRecord(table, set, values, "wording", wording);
        return { wording, ...args } as EpistatusObject;
    } catch (e) {
        console.error("Erreur lors de la mise à jour :", e);
        throw new Error("Erreur lors de la mise à jour de l'enregistrement");
    }
}

/**
 * Supprime un enregistrement de la table EPIStatus.
 * @param wording - La clé primaire de l'enregistrement à supprimer.
 * @returns `true` si la suppression réussit, sinon `false`.
 */
export async function deleteEpistatus(wording: string): Promise<boolean> {
    if (!wording) throw new Error("Le wording est requis pour la suppression");

    try {
        await db.deleteRecord(table, "wording", wording);
        return true;
    } catch (e) {
        console.error("Erreur lors de la suppression :", e);
        throw new Error("Erreur lors de la suppression de l'enregistrement");
    }
}
