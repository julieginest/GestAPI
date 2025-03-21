"use server"
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { readEpis } from "@/models/epiModel";
import { EpiObject } from "@/types/epi";
import {FormViaURL} from '@/forms/epiForm'
import { headers } from "next/headers";
import { CSSProperties } from "react";

const CreationForm = FormViaURL

export default async function Home(req: Request) {
  const models : EpiObject[] = await readEpis({})
  const heads = await headers()
  //const { searchParams } = new URL(heads.get("referer") || "");

  const url = heads.get("referer") || "";
  const parsedURL = URL.parse(url);
  const epiId = parsedURL?.searchParams.get('epi') as string;
  const create = parsedURL?.searchParams.get('create') as string;


  const page : CSSProperties = {
    display: "flex",
    flexDirection: "row",
    maxHeight:"100vh",
  }

  const epiList : CSSProperties ={
    flex:1,
    overflowY:"scroll",
    display: "flex",
    flexDirection:"column",
    alignSelf:"baseline",
    maxHeight:"100vh"
  }

  const epiA : CSSProperties ={
    alignContent: "left",
  }
  const epiImg : CSSProperties ={
    height:"5em",
    width:"auto",
    marginRight: "1em",
    padding:"0.5em",
    border: "1px solid black",
    borderRadius:"1em"
  }
  const epiEdit : CSSProperties = {
    position:"relative",
    height:"100%",
  }
  const epiEditInside : CSSProperties ={
    position:"sticky",
  }
  
  
  return (
    <div className={styles.page} style={page}>
      <div style={epiList}>

      <Link href={"/epi-list?create=true"}>
        <button style={{position:"sticky"}}>
            +
        </button>
      </Link>
      {models.map(c =>
      <Link key={c.Id} href={"/epi-list?epi="+c.Id} style={epiA}>
        <div>
          <Image
          src={'/'+c.typeWording+".jpg"}
          alt={c.typeWording}
          width={512}
          height={512}
          style={epiImg}/>
          <span >{c.typeWording} {c.brand} {c.model}</span>
        </div>
     </Link>
      )}
      </div>

      <hr />
      <div style={epiEdit}>
        <CreationForm style={epiEditInside}/>
        
      </div>


    </div>
  );
}
