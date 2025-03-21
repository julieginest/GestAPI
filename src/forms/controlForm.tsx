"use client"
import  formHandler  from "./formHandler"
import { useState, useEffect, useActionState } from 'react';

export default function Form(){
    
    const [state, act, pending] = useActionState(formHandler, undefined)
    
    return(
        <form action={act}>
            <div>
                <label htmlFor="comment">Commentaire</label>
                <input type="text" name="comment" id="comment" />
            </div>
            <div>
                <label htmlFor="date">date</label>
                <input type="date" name="date" id="date" />
            </div>
            <div>
                <label htmlFor="managerId">Manager</label>
                <input type="text" name="managerId" id="managerId" />
            </div>
            
            <div>
                <label htmlFor="epiId">EPI ID</label>
                <input type="text" name="epiId" id="epiId" />
            </div>
            <div>
                <label htmlFor="status">Status</label>
                <input type="text" name="status" id="status" />
            </div>
            <button type="submit">Créer</button>
            {state?.error?.message && <p style={{color:"red"}}>{state.error.message}</p>}
        </form>
        
    )
}

function Test(){
    const comment = document.getElementById("comment") ? document.getElementById("comment")?.nodeValue : "";
    const date = document.getElementById("date") ? document.getElementById("date")?.nodeValue : "";
    const epiId = document.getElementById("epiId") ? document.getElementById("epiId")?.nodeValue : "";
    const status = document.getElementById("status") ? document.getElementById("status")?.nodeValue : "";
    console.log(date)
    /*maintenancesModel.create(
        {
            comment: comment || "",
            date: date,
            epiId: epiId || "",
            status: status || "",
        }
    )*/
}