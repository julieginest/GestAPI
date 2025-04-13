"use client"
import { readEpistatus } from "@/models/epiStatusModel";
import formHandler from "./formHandler";
import { useState, useEffect, useActionState } from 'react';
import { useSearchParams } from "next/navigation";
import { EpistatusObject } from "@/types/epiStatus";
import {ControlObject} from '@/types/control'
import styles from "./controlForm.module.scss";
import { readControls } from "@/models/controlModel";

export default function Form({update, isGestionnaire, readOnly}:{update?:number, isGestionnaire: boolean, readOnly?:boolean}) {
    const [state, act, pending] = useActionState(formHandler, undefined);
    const searchParams = useSearchParams();
    const epiId = searchParams.get("epi");
    const create = searchParams.get("create");

    const [EPI, setEPI] = useState<string>("");
    const [statusList, setStatusList] = useState<EpistatusObject[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);

    const [formData, setFormData] = useState<ControlObject | undefined>();


    const fetchStatusTypes = async () => {
        try {
            const data = await readEpistatus({});
            setStatusList(data);
        } catch (err) {
            console.error("Erreur lors du chargement des status EPI :", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchControl = async () =>{
        if(update){
            try{
                const data = await readControls({Id:update})
                setFormData(data[0])
            }catch (err) {
                console.error("Erreur lors du chargement des types EPI :", err);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        console.log(formData);
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value 
        }) as ControlObject);
    };

    useEffect(() => {
        fetchStatusTypes();
    }, []);
    useEffect(() => {
        fetchControl();
    }, [update]);

    useEffect(() => {
        if(epiId) {
            setEPI(epiId);
        }
    }, [searchParams, epiId]);
    
    if(loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <div className={styles.formContainer}>
            <form action={act} className={styles.form}>
                {epiId && <div className={styles.epiIdDisplay}>EPI ID: {epiId}</div>}
                
                {/* Hidden fields */}
                <input 
                    readOnly 
                    type="text" 
                    name="table" 
                    id="table" 
                    value="Control" 
                    className={styles.hiddenField}
                />
                <input 
                    readOnly 
                    type="text" 
                    name="epiId" 
                    id="epiId" 
                    value={EPI} 
                    className={styles.hiddenField}
                />
                {update && (
                    <input 
                        readOnly 
                        type="number" 
                        name="currentId" 
                        id="currentId" 
                        value={update as number} 
                        className={styles.hiddenField}
                    />
                )}
                
                <div className={styles.formField}>
                    <label htmlFor="date" className={styles.fieldHeading}>Date de contrôle</label>
                    <input 
                        type="date" 
                        name="date" 
                        id="date" 
                        className={styles.dateInput}
                        readOnly={readOnly}
                        onChange={handleChange}
                        value={formData?.date ? formData.date.toISOString().split('T')[0] : undefined }
                    />
                </div>
                
                <div className={styles.formField}>
                    <label htmlFor="status" className={styles.fieldHeading}>Statut</label>
                    <select 
                        name="status" 
                        id="status" 
                        className={styles.statusSelect}
                        disabled={readOnly || !isGestionnaire}
                        value={
                            formData?.status || "Défectueux"
                        }
                        onChange={handleChange}
                    >
                        {statusList.map(t => (
                            <option key={t.wording} value={t.wording} selected>
                                {t.wording}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className={styles.formField}>
                    <label htmlFor="comment" className={styles.fieldHeading}>Commentaire</label>
                    <textarea 
                        id="comment" 
                        name="comment"
                        className={styles.commentArea}
                        readOnly={readOnly}
                        onChange={handleChange}
                        value={formData?.comment || ""}
                    ></textarea>
                </div>
                
                {!readOnly && (
                    <button type="submit" className={styles.submitButton}>
                        {update ? "Modifier" : "Créer"}
                    </button>
                )}
                
                {state?.error?.message && (
                    <p className={styles.errorMessage}>{state.error.message}</p>
                )}
            </form>
        </div>
    );
}