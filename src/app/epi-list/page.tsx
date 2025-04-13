"use server"
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/page.module.css";
import epiStyles from "./page.module.scss";
import { readEpis } from "@/models/epiModel";
import { EpiObject } from "@/types/epi";
import { FormViaURL } from '@/forms/epiForm'
import { headers } from "next/headers";
import { List } from "./controlList"
import { GET } from "@/app/Account/isConnected"

const CreationForm = FormViaURL

export default async function Home(req: Request) {
  const user = await GET()
  const userValid = user.isValid
  const isGestionnaire = user.isValid ? user.user.typeName == "gestionnaire" : false
  
  const models: EpiObject[] = await readEpis({})
  const heads = await headers()

  const url = heads.get("referer") || "";
  const parsedURL = URL.parse(url);
  const epiId = parsedURL?.searchParams.get('epi') as string;
  const create = parsedURL?.searchParams.get('create') as string;
  
  return (
    <div className={`${styles.page} ${epiStyles.page}`}>
      <div className={epiStyles.epiList}>
        <Link href={"/epi-list?create=true"}>
          <button className={epiStyles.addButton}>
            <span>+</span> Ajouter un ÉPI
          </button>
        </Link>
        
        {models.map(c => (
          <Link 
            key={c.Id} 
            href={"/epi-list?epi="+c.Id} 
            className={epiId === c.Id ? epiStyles.epiItemSelected : epiStyles.epiItem}
          >
            <Image
              src={'/'+c.typeWording+".jpg"}
              alt={c.typeWording}
              width={512}
              height={512}
              className={epiStyles.epiImg}
            />
            <div className={epiStyles.epiTextContainer}>
              <span className={epiStyles.epiName}>{c.typeWording}</span>
              <span className={epiStyles.epiDetails}>{c.brand} {c.model}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={epiStyles.divider}></div>
      
      <div className={epiStyles.epiEdit}>
        {epiId || create ? (
          <>
            <CreationForm /*className={epiStyles.epiEditInside}*/ readOnly={!isGestionnaire} />
            <div className={epiStyles.controlsSection}>
              <h3 className={epiStyles.controlsHeading}>
                Historique des contrôles
              </h3>
              <List userId={userValid ? user.user.Id : undefined} isGestionnaire={isGestionnaire}/>
            </div>
          </>
        ) : (
          <div className={epiStyles.noSelectionMessage}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            <p>Sélectionnez un équipement ou créez-en un nouveau</p>
          </div>
        )}
      </div>
    </div>
  );
}