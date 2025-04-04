"use client"

import { useSearchParams } from "next/navigation";
import { readControls } from "@/models/controlModel";
import { useState, useEffect, CSSProperties } from 'react';
import { ControlObject } from "@/types/control";
import style from "./controlList.module.scss"
import ControlForm  from "@/forms/controlForm" ;


/***** Image *****/
import Image from "next/image";
import Poubelle from "@/../public/Poubelle.svg"
import Stylo from "@/../public/Stylo.svg"
/***** ***** *****/



export function List(){


    
      

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
            <span>
                Chargement ...
            </span>
        )
    }

    return (

        <div>
          {
            newControl || editing ?
            <button style={{width:"100%"}} onClick={plusButton}>Annuler</button>
            :
            <button style={{width:"100%"}} onClick={plusButton}> +</button>
          }
          {
            editing && !newControl ? <ControlForm update={editing}/> : <></>
          }
          {
            !editing && newControl ? <ControlForm/> : <></>
          }
          <div>
              {epiId ?
          listData.map(c => 
            <div key={c.Id} className={style.controlItem} id={editing == c.Id ? style.selectedControlItem : undefined}>
              <div className={style.controlItemDiv}>
                <span className={style.controlItemDivSpan}>
                  {c.managerId}
                </span>
                <span className={style.controlItemDivSpan}>
                  {c.date.getDay().toString().padStart(2, '0')}
                  /
                  {c.date.getMonth().toString().padStart(2, '0')}
                  /
                  {c.date.getFullYear()}
                </span>
                <div style={{display:"flex",alignItems:"center"}}>
                  <Image
                  onClick={() => {
                    setEditing(c.Id)
                    changeNewControl(false)
                  }}
                  src={Stylo}
                  width={512}
                  height={512}
                  className={style.imageButton}
                  alt="Edition"
                  />
                  <Image
                  onClick={() => {
                    setDeleting(c.Id);
                  }}
                  src={Poubelle}
                  width={512}
                  height={512}
                  className={style.imageButton}
                  alt="Supprimer"
                  />
                </div>
              </div>
              <p className={style.controlItemComment}>
                {c.comment}
              </p>
            </div>
          ): <></>}
          </div>
        </div>
    )
}