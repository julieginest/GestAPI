"use client"

import { useSearchParams } from "next/navigation";
import { readControls } from "@/models/controlModel";
import { useState, useEffect } from 'react';
import { ControlObject } from "@/types/control";
import styles from "./controlList.module.scss"
import ControlForm  from "@/forms/controlForm";

// Images
import Image from "next/image";
import Poubelle from "@/../public/Poubelle.svg"
import Stylo from "@/../public/Stylo.svg"

export function List({userId, isGestionnaire}:{userId?:string, isGestionnaire?:boolean}){
    const searchParams = useSearchParams();
    const epiId = searchParams.get("epi");

    const [listData, setListData] = useState<ControlObject[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [editing, setEditing] = useState<number | undefined>(undefined)
    const [deleting, setDeleting] = useState<number | undefined>(undefined)
    const [newControl, changeNewControl] = useState<Boolean>(false);

    function plusButton(){
      if(newControl || editing){
          changeNewControl(false)
          setEditing(undefined)
      }else{
          changeNewControl(true)
      }
    }

    async function getControlList(){
        setLoading(true)
        if(epiId){
            let controlList = await readControls({epiId:epiId})
            setListData(controlList);
        }
        setLoading(false)
    }

    useEffect(() => {
        getControlList()
    }, [epiId]);

    if(loading){
        return(
            <div className={styles.loading}>
                Chargement...
            </div>
        )
    }

    return (
        <div className={styles.controlList}>
          {newControl || editing ? (
            <button 
              className={`${styles.controlButton} ${styles.cancelButton}`} 
              onClick={plusButton}
            >
              Annuler
            </button>
          ) : (
            <button 
              className={styles.controlButton}
              onClick={plusButton}
            >
              + Ajouter un contrôle
            </button>
          )}
          
          {editing && !newControl ? (
            <ControlForm update={editing} isGestionnaire={isGestionnaire ? isGestionnaire : false}/>
          ) : null}
          
          {!editing && newControl ? (
            <ControlForm isGestionnaire={isGestionnaire ? isGestionnaire : false}/>
          ) : null}
          
          <div>
            {epiId && listData.length > 0 ? (
              listData.map(c => (
                <div 
                  key={c.Id} 
                  className={styles.controlItem} 
                  id={editing === c.Id ? styles.selectedControlItem : undefined}
                >
                  <div className={styles.controlItemDiv}>
                    <span className={styles.controlItemDivSpan}>
                      {c.managerId}
                    </span>
                    <span className={styles.controlItemDivSpan}>
                      {c.date.getDay().toString().padStart(2, '0')}
                      /
                      {c.date.getMonth().toString().padStart(2, '0')}
                      /
                      {c.date.getFullYear()}
                    </span>
                    <div className={styles.actionButtons}>
                      <Image
                        onClick={() => {
                          setEditing(c.Id)
                          changeNewControl(false)
                        }}
                        src={Stylo}
                        width={512}
                        height={512}
                        className={styles.imageButton}
                        alt="Edition"
                        hidden={(userId !== c.managerId) && !isGestionnaire}
                      />
                      <Image
                        onClick={() => {
                          setDeleting(c.Id);
                        }}
                        src={Poubelle}
                        width={512}
                        height={512}
                        className={styles.imageButton}
                        alt="Supprimer"
                        hidden={(userId !== c.managerId) && !isGestionnaire}
                      />
                    </div>
                  </div>
                  <p className={styles.controlItemComment}>
                    {c.comment}
                  </p>
                </div>
              ))
            ) : epiId ? (
              <div className={styles.noItems}>
                Aucun contrôle n'a été effectué pour cet équipement
              </div>
            ) : (
              <div className={styles.emptyState}>
                Sélectionnez un équipement pour voir ses contrôles
              </div>
            )}
          </div>
        </div>
    )
}