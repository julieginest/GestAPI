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
    host: BDD_HOST || "j.ginestiere.fr",
    port:  BDD_PORT || 3307,
    user: BDD_USER || "root",
    password: BDD_PASSWORD || "your_password",
    database : BDD_DATABASE || "Istres",
    connectionLimit: 5
});


export const db = {
    newRecord: async (table: string, fields: string[], values: any[]): Promise<any> =>{
        var conn;
        var rows: any[] = [];

        try{
            conn = await pool.getConnection();
            
            rows = await pool.query(`INSERT INTO ${table} (${fields.join(", ")}) VALUES(${fields.map(m => {return "?,"}).slice(0,-1)})`,values)
        }catch(e){
            
        }finally{
            if(conn) conn.release();
        }

        return rows[0];
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
            
        }finally{
            if(conn) conn.release();
        }

        return rows[0];
    }
}