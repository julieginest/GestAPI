/**** Imports ****/
import { pool } from "./database"
import {ControlObject,ControlQuery} from "../types/control"

export const maintenancesModel = {
    get: async (args: ControlQuery): Promise<ControlObject[]> =>{
        var where: string = " "
        var values: any[] =[]
        
        if(args.Id){
            where += "Id = ?"
            values.push(args.Id)
        };
        if(args.comment){
            where += "comment = ?"
            values.push(args.comment)
        };
        if(args.date){
            where += "date = ?"
            values.push(args.date)
        };
        if(args.managerId){
            where += "managerId = ?"
            values.push(args.managerId)
        };
        if(args.epiId){
            where += "epiId = ?"
            values.push(args.epiId)
        };
        if(args.status){
            where += "status = ?"
            values.push(args.status)
        };

        var conn;
        var rows: ControlObject[];

        try{
            conn = await pool.getConnection();
            
            rows = await pool.query(`select * from Controls${where}`,values)
        }catch(e){
            rows = [];
        }finally{
            if(conn) conn.release();
        }

        return rows;
        
    },

    update: async (args: ControlQuery, Id?: number | null): Promise<ControlObject> =>{
        var set: string = " "
        var values: any[] =[]
        
       
       
        if(args.comment){
            set += "comment = ?"
            values.push(args.comment)
        };
        if(args.date){
            set += "date = ?"
            values.push(args.date)
        };
        if(args.managerId){
            set += "managerId = ?"
            values.push(args.managerId)
        };
        if(args.epiId){
            set += "epiId = ?"
            values.push(args.epiId)
        };
        if(args.status){
            set += "status = ?"
            values.push(args.status)
        };



        if(
            (!args.Id && !Id) ||
            (args.Id != (Id || null)) ||
            (Id != (args.Id || null))
        ){
            throw new Error("Error in Id definition");
        }else{
            values.push(Id || args.Id);
        };

        var conn;
        var rows: ControlObject[] = [];

        try{
            conn = await pool.getConnection();
            
            rows = await pool.query(`UPDATE Controls${set} WHERE Id = ?`,values)
        }catch(e){
            
        }finally{
            if(conn) conn.release();
        }

        return rows[0];
        
        
    },

    delete: async (Id?: number | null): Promise<ControlObject> =>{
        var values: any[] = [];
        
       
       
        
        var conn;
        var rows: ControlObject[] = [] 

        try{
            conn = await pool.getConnection();
            
            rows = await pool.query(`DELETE FROM Controls WHERE Id = ?`,values)
        }catch(e){
            
        }finally{
            if(conn) conn.release();
        }

        return rows[0];
        
        
    },


}