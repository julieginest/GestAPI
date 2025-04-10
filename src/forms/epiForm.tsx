"use client"
import  formHandler  from "./formHandler"
import { useState, useEffect, useActionState } from 'react';
import { EpitypesObject } from "@/types/epiType";
import { readEpiTypes } from '@/models/epiTypeModel';
import { readEpis } from "@/models/epiModel";
import { EpistatusObject } from "@/types/epiStatus";
import { readEpistatus } from "@/models/epiStatusModel";
import { readControls } from "@/models/controlModel";
import { usePathname, useSearchParams } from "next/navigation";
import { EpiObject, EpiQuery } from "@/types/epi";
import { create } from "domain";
import { CSSProperties } from "react";
import Link from "next/link";
import ControlForm  from "./controlForm" ;


export function FormViaURL({style}:{style?:CSSProperties}){
    const searchParams = useSearchParams();
    const epiId = searchParams.get("epi");
    const create = searchParams.get("create");

    const [newControl, changeNewControl] = useState<Boolean>(false);
    // const [statusList, setStatusList] = useState<EpistatusObject[]>([])
    // const [loading, setLoading] = useState<Boolean>(true)

    function plusButton(){
        if(newControl){
            changeNewControl(false)
        }else{
            changeNewControl(true)
        }
    }

    // const fetchEpiTypes = async () => {
    //     try {
    //         const data = await readEpistatus({});
    //         setStatusList(data);
    //     } catch (err) {
    //         console.error("Erreur lors du chargement des status EPI :", err);
    //     } finally {
    //         setLoading                  
    //         (false);
    //     }
    // };
    // useEffect(()=>{
    //     fetchEpiTypes();
        
    // },[])
    
    // if(loading){
    //     return <span>Chargement...</span>
    // }
    return (
        <>
            
            {epiId && !create ? <>
                <Link style={{position: "absolute", top:0, right:0, textAlign:"left"}} href={"/epi-list"}>X</Link>
                <Form action="update" /> 

                {/*
                    // newControl ?<>
                    // <button style={{width:"100%"}} onClick={plusButton}>Annuler</button>
                    // <ControlForm/>
                    { /*<form action="">

                    <input readOnly type="text" name="table" id="table" value="EPIs" style={{visibility:"hidden"}}/>
                        <input readOnly type="text" name="epiId" id="epiId" value={searchParams.get('epi') as string} style={{visibility:"hidden"}}/>
                        <div>
                            <label htmlFor="date">Date de control</label>
                            <input type="date" name="date" id="date" /*value={formData?.purchase ? new Date(formData.purchase).toISOString().split('T')[0] : ""} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="typeWording">Type</label>
                            <select name="status" id="status" /*value={formData?.typeWording || epiEdit?.typeWording} onChange={handleChange}>
                                {
                                    statusList.map(
                                        t =>
                                            <option key={t.wording} value={t.wording} /*selected={t.wordingEn === formData?.typeWording} >{t.wording}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            {/*<label htmlFor="comment">Marque</label>}
                            <textarea style={{resize:"none", width:"100%"}} id="comment" name="comment" /* onChange={handleChange} >{/*value={formData?.brand || ""} </textarea>
                        </div>
                        <button type="submit">{"create" == "create" ? "Créer" : "Modifier"}</button>
                    </form>}
                    // </>
                    // :
                    // <button style={{width:"100%"}} onClick={plusButton}> +</button>
                    
                */}

                </>: null}
            {!epiId && create ? <>
                <Link style={{position: "absolute", top:0, right:0, textAlign:"left"}} href={"/epi-list"}>X</Link>
                <Form action="create" /> </>: null}
        </>
    )

}


export function Form({action, style}:{action:"create" | "update",style?:CSSProperties}){
    
    const pathname = usePathname()
    const searchParams = useSearchParams();

    const [state, act, pending] = useActionState(formHandler, undefined)
    
    const [loading, setLoading] = useState<Boolean>(true)
    const [epiTypes, setTypes] = useState<EpitypesObject[]>([])
    const [epiEdit, setEpiEdit] = useState<EpiObject>()

    const [formData, setFormData] = useState<EpiObject | undefined>();

useEffect(() => {
    setFormData(epiEdit);
}, [epiEdit]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(formData)
    setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value 
    }) as EpiObject);
};
    
    
    //const EpiId = 

    const fetchEpiTypes = async () => {
        try {
          const data = await readEpiTypes({});
          setTypes(data);
        } catch (err) {
          console.error("Erreur lors du chargement des types EPI :", err);
        } finally {
          setLoading                  
          (false);
        }
      };

      const fetchEpi = async () => {
        const EpiId = searchParams.get('epi') as string;
          try {
            const data = await readEpis({Id:EpiId});
            setEpiEdit(data[0]);
          } catch (err) {
            <button>+</button>
            console.error("Erreur lors du chargement des types EPI :", err);
          } finally {
            setLoading(false);
          }
        };

    useEffect(()=>{
          //fetchEpi();
          fetchEpiTypes();
    },[])

    useEffect(()=>{

        if(action == "create"){
            setEpiEdit(undefined)
          }else{
              fetchEpi();
          }
    },[searchParams])

    
    
if(loading){
    return <span>Chargement...</span>
}
return(
    <form action={act} style={style}>
        <input readOnly type="text" name="table" id="table" value="EPIs" style={{visibility:"hidden"}}/>
        {action == "update" ? <input readOnly type="text" name="currentId" id="currentId" value={searchParams.get('epi') as string} style={{visibility:"hidden"}}/> : null}
        <div>
            <label htmlFor="Id">Id</label>
            <input type="text" name="Id" id="Id"  readOnly={action == "update"} value={formData?.Id || ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="typeWording">Type</label>
            <select name="typeWording" id="typeWording" value={formData?.typeWording || epiEdit?.typeWording} onChange={handleChange}>
                {
                    epiTypes.map(
                        t =>
                            <option key={t.wordingEn} value={t.wordingEn} /*selected={t.wordingEn === formData?.typeWording}*/ >{t.wordingFr}</option>
                    )
                }
            </select>
        </div>
        <div>
            <label htmlFor="brand">Marque</label>
            <input type="text" name="brand" id="brand" value={formData?.brand || ""} onChange={handleChange}/>
        </div>
        
        <div>
            <label htmlFor="model">Model</label>
            <input type="text" name="model" id="model" value={formData?.model || ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="serieNo">Numero de série</label>
            <input type="text" name="serieNo" id="serieNo" value={formData?.serieNo || ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="size">Taille</label>
            <input type="text" name="size" id="size" value={formData?.size || ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="color">Couleur</label>
            <input type="text" name="color" id="color" value={formData?.color || ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="purchase">Date d'achat</label>
            <input type="date" name="purchase" id="purchase" value={formData?.purchase ? new Date(formData.purchase).toISOString().split('T')[0] : ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="manufacture">Date de fabrication</label>
            <input type="date" name="manufacture" id="manufacture" value={formData?.manufacture ? new Date(formData.manufacture).toISOString().split('T')[0] : ""} onChange={handleChange}/>
        </div>
        <div>
            <label htmlFor="commissioning">Date de mise en service</label>
            <input type="date" name="commissioning" id="commissioning" value={formData?.commissioning ? new Date(formData.commissioning).toISOString().split('T')[0] : ""} onChange={handleChange}/>
        </div>
        <button type="submit">{action == "create" ? "Créer" : "Modifier"}</button>
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

/*function ListControl({Id}:{Id:string}){
    const [state, act, pending] = useActionState(readControls, undefined)
    useEffect(() => {
        act({ epiId: Id }); // Appel seulement après le rendu initial
    }, [Id]);
    return<>
    
    </>
}*/

/*function ListControl({ Id }: { Id: string }) {
    const [state, act, pending] = useActionState(readControls, undefined);

    useEffect(() => {
        act({ epiId: Id }); // Appel seulement après le rendu initial
    }, [Id]); // Re-exécute si Id change

    return <>{pending ? "Loading..." : JSON.stringify(state)}</>;
}
*/