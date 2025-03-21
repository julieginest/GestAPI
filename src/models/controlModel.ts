"use server"
/**** Imports ****/
import { pool, db } from "./database";
import { ControlObject, ControlQuery, ControlCreation } from "../types/control";

/**
 * Crée un nouvel enregistrement dans la table Controls.
 * @param args - Les données de création de l'enregistrement.
 * @returns `true` si l'insertion réussit, sinon `false`.
 */
export async function createControl(args: ControlCreation): Promise<boolean> {
    try {
        await db.newRecord(
            "Controls",
            Object.keys(args),
            Object.values({
                ...args,
                date: args.date.toISOString().split("T")[0], // Formatage de la date
            })
        );
        return true;
    } catch (e) {
        console.error("Erreur lors de la création :", e);
        throw new Error("Erreur lors de la création de l'enregistrement");
    }
}

/**
 * Récupère des enregistrements de la table Controls en fonction des critères de recherche.
 * @param args - Les critères de recherche.
 * @returns Un tableau d'objets `ControlObject`.
 */
export async function readControls(args: ControlQuery): Promise<ControlObject[]> {
    let where: string[] = [];
    let values: any[] = [];

    Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined) {
            where.push(`${key} = ?`);
            values.push(value);
        }
    });

    const whereString = where.length ? ` WHERE ${where.join(" AND ")}` : "";

    let conn;
    let rows: ControlObject[] = [];

    try {
        conn = await pool.getConnection();
        rows = await conn.query(`SELECT * FROM Controls${whereString}`, values);
    } catch (e) {
        console.error("Erreur lors de la lecture :", e);
        throw new Error("Erreur lors de la récupération des enregistrements");
    } finally {
        if (conn) conn.release();
    }

    return rows;
}

/**
 * Met à jour un enregistrement dans la table Controls.
 * @param args - Les nouvelles valeurs de l'enregistrement.
 * @param Id - La clé primaire de l'enregistrement à mettre à jour.
 * @returns L'enregistrement mis à jour.
 */
export async function updateControl(args: ControlQuery, Id: number): Promise<ControlObject> {
    if (!Id) throw new Error("ID requis pour la mise à jour");

    let set: string[] = [];
    let values: any[] = [];

    Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined) {
            set.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (set.length === 0) throw new Error("Aucune donnée à mettre à jour");

    values.push(Id); // Ajout de l'ID à la fin des valeurs

    let conn;
    let rows: ControlObject[] = [];

    try {
        conn = await pool.getConnection();
        rows = await conn.query(`UPDATE Controls SET ${set.join(", ")} WHERE Id = ?`, values);
    } catch (e) {
        console.error("Erreur lors de la mise à jour :", e);
        throw new Error("Erreur lors de la mise à jour de l'enregistrement");
    } finally {
        if (conn) conn.release();
    }

    return rows[0];
}

/**
 * Supprime un enregistrement de la table Controls.
 * @param Id - La clé primaire de l'enregistrement à supprimer.
 * @returns `true` si la suppression réussit, sinon `false`.
 */
export async function deleteControl(Id: number): Promise<boolean> {
    if (!Id) throw new Error("ID requis pour la suppression");

    let conn;

    try {
        conn = await pool.getConnection();
        await conn.query(`DELETE FROM Controls WHERE Id = ?`, [Id]);
        return true;
    } catch (e) {
        console.error("Erreur lors de la suppression :", e);
        throw new Error("Erreur lors de la suppression de l'enregistrement");
    } finally {
        if (conn) conn.release();
    }
}
