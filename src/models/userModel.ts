/**** Imports ****/
import { db } from "./database";
import { UserObject, UserQuery } from "../types/user";

const table = "Users";

/**
 * Crée un nouvel enregistrement dans la table Users.
 * @param args - Les données de création de l'utilisateur.
 * @returns `true` si l'insertion réussit, sinon `false`.
 */
export async function createUser(args: UserObject): Promise<boolean> {
    try {
        await db.newRecord(
            table,
            Object.keys(args),
            Object.values(args)
        );
        return true;
    } catch (e) {
        console.error("Erreur lors de la création de l'utilisateur :", e);
        throw new Error("Erreur lors de la création de l'utilisateur");
    }
}

/**
 * Récupère des enregistrements de la table Users en fonction des critères de recherche.
 * @param args - Les critères de recherche.
 * @returns Un tableau d'objets `UserObject`.
 */
export async function readUsers(args: UserQuery): Promise<UserObject[]> {
    try {
        return await db.readRecords(table, args);
      } catch (e) {
        console.error("Erreur lors de la lecture :", e);
        throw e;
      }
}

/**
 * Met à jour un enregistrement dans la table Users.
 * @param args - Les nouvelles valeurs de l'utilisateur.
 * @param Id - La clé primaire de l'utilisateur à mettre à jour.
 * @returns L'enregistrement mis à jour.
 */
export async function updateUser(args: UserQuery, Id: string): Promise<UserObject> {
    if (!Id) throw new Error("L'Id est requis pour la mise à jour");

    let set: string[] = [];
    let values: any[] = [];

    Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined) {
            set.push(`${key} = ?`);
            values.push(value);
        }
    });

    if (set.length === 0) throw new Error("Aucune donnée à mettre à jour");

    values.push(Id); // Ajout de l'Id à la fin des valeurs

    try {
        await db.updateRecord(table, set, values, "Id", Id);
        return { Id, ...args } as UserObject;
    } catch (e) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", e);
        throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
}

/**
 * Supprime un enregistrement de la table Users.
 * @param Id - La clé primaire de l'utilisateur à supprimer.
 * @returns `true` si la suppression réussit, sinon `false`.
 */
export async function deleteUser(Id: string): Promise<boolean> {
    if (!Id) throw new Error("L'Id est requis pour la suppression");

    try {
        await db.deleteRecord(table, "Id", Id);
        return true;
    } catch (e) {
        console.error("Erreur lors de la suppression de l'utilisateur :", e);
        throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
}
