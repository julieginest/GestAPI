/**** Imports ****/
import { table } from "console";
import { promises } from "dns";
import mariadb from "mariadb";

require("dotenv").config();

/**** .env ****/
var BDD_HOST = process.env.BDD_HOST;
var BDD_PORT = Number(process.env.BDD_PORT);
var BDD_USER = process.env.BDD_USER;
var BDD_PASSWORD = process.env.BDD_PASSWORD;
var BDD_DATABASE = process.env.BDD_DATABASE;

/**** Pool ****/
export const pool = mariadb.createPool({
    host: BDD_HOST || "localhost",
    port:  BDD_PORT || 3307,
    user: BDD_USER || "root",
    password: BDD_PASSWORD || "your_password",
    database : BDD_DATABASE || "GestEPI",
    connectionLimit: 5
});


export const db = {
    newRecord: async (table: string, fields: string[], values: any[]): Promise<any> =>{
        var conn;
        var response;

        try{
            conn = await pool.getConnection();
            response = await conn.query(`INSERT INTO ${table} (${fields.join(", ")}) VALUES(${values.map(m => {return "?"})}) RETURNING *;`,values)
        }catch(e){
            console.log("Erreur SQL")
            console.error(e)
            throw e;
        }finally{
            if(conn) conn.release();
        }

        return response;
    },
    updateRecord: async (table: string, fields: string[], values: any[], primaryFields: string /*| string[]*/, primaryValues: string /*| string[]*/): Promise<any> =>{
        var conn;
        var response;

        values.push(primaryValues)

        //const WHERE : string = typeof(primaryFields) == "string" ? `${primaryFields} = ?` : primaryFields.join("= ? AND ");

        try{
            conn = await pool.getConnection();
            response = await conn.query(`UPDATE ${table} SET ${fields.join(" = ? , ")} = ? WHERE ${primaryFields} = ? ;`,values)
        }catch(e){
            console.log("Erreur SQL")
            console.error(e)
            throw e;
        }finally{
            if(conn) conn.release();
        }

        return response;
    },

    deleteRecord: async (table:string, PKFields:string|string[], PKValues: string | number | any[]): Promise<any> =>{
        var conn;
        var rows: any[] = []

        if(typeof(PKFields) == "object" && typeof(PKValues) == "object"){
            if(PKFields.length == PKValues.length){
                PKFields = PKFields.map(m => {return `${m} = ? AND `})
                PKFields = PKFields.slice(0,-4)
            }else{
                throw new Error("Both 'PKFields' and 'PKValues' array must be same lenght")
            }
        }else{
            if(typeof(PKFields) == "string" && typeof(PKValues) == ("number" || "string")){
                PKValues = [PKValues];
            }else{
                throw new Error("'PKFields' and 'PKValues' must be either both array or respectively a string and a string or a number")
            }
        }

        try{
            conn = await pool.getConnection();
            
            rows = await pool.query(`DELETE FROM ${table} WHERE ${PKFields}`,PKValues)
        }catch(e){
            console.log("Erreur SQL")
            console.error(e)
            throw e;
        }finally{
            if(conn) conn.release();
        }

        return rows[0];
    },



    readRecords: async (table: string, conditions: Record<string, any>): Promise<any[]> => {
        let conn;
        let rows: any[] = [];
        let where: string[] = [];
        let values: any[] = [];

        Object.entries(conditions).forEach(([key, value]) => {
            if (value !== undefined) {
                if(table=="Users" && key == "pswd"){
                    where.push(`${key} = SHA2(?,256)`)
                }else{
                    where.push(`${key} = ?`);
                }
                values.push(value);
            }
        });

        const whereString = where.length ? ` WHERE ${where.join(" AND ")}` : "";

        try {
            conn = await pool.getConnection();
            rows = await conn.query(`SELECT * FROM ${table}${whereString}`, values);
        } catch (e) {
            console.log("Erreur SQL")
            console.error(e)
            throw e;
        } finally {
            if (conn) conn.release();
        }

        return rows;
    },

    
}