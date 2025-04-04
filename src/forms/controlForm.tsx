"use client"
import { readEpistatus } from "@/models/epiStatusModel";
import  formHandler  from "./formHandler"
import { useState, useEffect, useActionState } from 'react';
import { useSearchParams } from "next/navigation";
import { EpistatusObject } from "@/types/epiStatus";

export default function Form({update}:{update?:number}){
    
    const [state, act, pending] = useActionState(formHandler, undefined)
    const searchParams = useSearchParams();
    const epiId = searchParams.get("epi");
    const create = searchParams.get("create");

    const [EPI, setEPI] = useState<string>("")
    const [statusList, setStatusList] = useState<EpistatusObject[]>([])
    const [loading, setLoading] = useState<Boolean>(true)


    const fetchEpiTypes = async () => {
        try {
            const data = await readEpistatus({});
            setStatusList(data);
        } catch (err) {
            console.error("Erreur lors du chargement des status EPI :", err);
        } finally {
            setLoading                  
            (false);
        }
    };
    useEffect(()=>{
        fetchEpiTypes();
    },[])
    useEffect(()=>{
        if(epiId){
            setEPI(epiId)
        }
    },[searchParams])
    
    if(loading){
        return <span>Chargement...</span>
    }

    return(
        <form action={act}>
            <span>{epiId}</span>
            <input readOnly type="text" name="table" id="table" value="Control" style={{visibility:"hidden"}}/>
            <input readOnly type="text" name="epiId" id="epiId" value={EPI} style={{visibility:"hidden"}}/>
            {update ? <input readOnly type="number" name="currentId" id="currentId" value={update as number} style={{visibility:"hidden"}}/> : null}
            <div>
                {/*<label htmlFor="date">Date de control</label>*/}
                <input type="date" name="date" id="date" /*value={formData?.purchase ? new Date(formData.purchase).toISOString().split('T')[0] : ""} onChange={handleChange}*//>
            </div>
            <div>
                {/*<label htmlFor="typeWording">Type</label>*/}
                <select name="status" id="status" /*value={formData?.typeWording || epiEdit?.typeWording} onChange={handleChange}*/>
                    {
                        statusList.map(
                            t =>
                                <option key={t.wording} value={t.wording} /*selected={t.wordingEn === formData?.typeWording}*/ >{t.wording}</option>
                        )
                    }
                </select>
            </div>
            <div>
                {/*<label htmlFor="comment">Marque</label>*/}
                <textarea style={{resize:"none", width:"100%"}} id="comment" name="comment" /* onChange={handleChange} */>{/*value={formData?.brand || ""} */}</textarea>
            </div>
            <button type="submit">{update ? "Modifier" : "Créer"}</button>
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