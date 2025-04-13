"use client"
import formHandler from "./formHandler"
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
import Link from "next/link";
import ControlForm from "./controlForm";
import styles from "./epiForm.module.scss";

export function FormViaURL({ style, readOnly }: { style?: React.CSSProperties, readOnly?: boolean }) {
    const searchParams = useSearchParams();
    const epiId = searchParams.get("epi");
    const create = searchParams.get("create");

    const [newControl, changeNewControl] = useState<Boolean>(false);
    return (
        <div className={styles.formContainer}>
            {epiId && !create ? (
                <>
                    <Link className={styles.closeButton} href={"/epi-list"}>X</Link>
                    <Form action="update" readOnly={readOnly} />
                </>
            ) : null}
            
            {!epiId && create ? (
                <>
                    <Link className={styles.closeButton} href={"/epi-list"}>X</Link>
                    <Form action="create" readOnly={readOnly} />
                </>
            ) : null}
        </div>
    );
}

export function Form({ action, style, readOnly }: { action: "create" | "update", style?: React.CSSProperties, readOnly?: boolean }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [state, act, pending] = useActionState(formHandler, undefined);
    
    const [loading, setLoading] = useState<Boolean>(true);
    const [epiTypes, setTypes] = useState<EpitypesObject[]>([]);
    const [epiEdit, setEpiEdit] = useState<EpiObject>();

    const [formData, setFormData] = useState<EpiObject | undefined>();

    useEffect(() => {
        setFormData(epiEdit);
    }, [epiEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        console.log(formData);
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value 
        }) as EpiObject);
    };
    
    const fetchEpiTypes = async () => {
        try {
            const data = await readEpiTypes({});
            setTypes(data);
        } catch (err) {
            console.error("Erreur lors du chargement des types EPI :", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEpi = async () => {
        const EpiId = searchParams.get('epi') as string;
        try {
            const data = await readEpis({ Id: EpiId });
            setEpiEdit(data[0]);
        } catch (err) {
            console.error("Erreur lors du chargement des types EPI :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEpiTypes();
    }, []);

    useEffect(() => {
        if (action == "create") {
            setEpiEdit(undefined);
        } else {
            fetchEpi();
        }
    }, [searchParams, action]);
    
    if (loading) {
        return <div className={styles.loading}>Chargement...</div>;
    }

    return (
        <form action={act} className={styles.form}>
            <input 
                readOnly 
                type="text" 
                name="table" 
                id="table" 
                value="EPIs" 
                className={styles.hiddenField}
            />
            
            {action == "update" && (
                <input 
                    readOnly 
                    type="text" 
                    name="currentId" 
                    id="currentId" 
                    value={searchParams.get('epi') as string} 
                    className={styles.hiddenField}
                />
            )}
            
            <div className={styles.formField}>
                <label htmlFor="Id">Id</label>
                <input 
                    type="text" 
                    name="Id" 
                    id="Id"  
                    readOnly={action == "update" || readOnly} 
                    value={formData?.Id || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="typeWording">Type</label>
                <select 
                    name="typeWording" 
                    id="typeWording" 
                    value={formData?.typeWording || epiEdit?.typeWording} 
                    onChange={handleChange}
                    disabled={readOnly}
                >
                    {epiTypes.map(t => (
                        <option key={t.wordingEn} value={t.wordingEn}>
                            {t.wordingFr}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="brand">Marque</label>
                <input 
                    type="text" 
                    name="brand" 
                    id="brand" 
                    readOnly={readOnly} 
                    value={formData?.brand || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="model">Model</label>
                <input 
                    type="text" 
                    name="model" 
                    id="model" 
                    readOnly={readOnly} 
                    value={formData?.model || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="serieNo">Numero de série</label>
                <input 
                    type="text" 
                    name="serieNo" 
                    id="serieNo" 
                    readOnly={readOnly} 
                    value={formData?.serieNo || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="size">Taille</label>
                <input 
                    type="text" 
                    name="size" 
                    id="size" 
                    readOnly={readOnly} 
                    value={formData?.size || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="color">Couleur</label>
                <input 
                    type="text" 
                    name="color" 
                    id="color" 
                    readOnly={readOnly} 
                    value={formData?.color || ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="purchase">Date d'achat</label>
                <input 
                    type="date" 
                    name="purchase" 
                    id="purchase" 
                    readOnly={readOnly} 
                    value={formData?.purchase ? new Date(formData.purchase).toISOString().split('T')[0] : ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="manufacture">Date de fabrication</label>
                <input 
                    type="date" 
                    name="manufacture" 
                    id="manufacture" 
                    readOnly={readOnly} 
                    value={formData?.manufacture ? new Date(formData.manufacture).toISOString().split('T')[0] : ""} 
                    onChange={handleChange}
                />
            </div>
            
            <div className={styles.formField}>
                <label htmlFor="commissioning">Date de mise en service</label>
                <input 
                    type="date" 
                    name="commissioning" 
                    id="commissioning" 
                    readOnly={readOnly} 
                    value={formData?.commissioning ? new Date(formData.commissioning).toISOString().split('T')[0] : ""} 
                    onChange={handleChange}
                />
            </div>
            
            {!readOnly && (
                <button type="submit" className={styles.button}>
                    {action == "create" ? "Créer" : "Modifier"}
                </button>
            )}
            
            {state?.error?.message && (
                <p className={styles.errorMessage}>{state.error.message}</p>
            )}
        </form>
    );
}