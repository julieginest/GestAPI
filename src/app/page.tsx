"use server"
import Link from "next/link";
import styles from "./page.module.css";
import { EpiObject } from "@/types/epi";
import { cursorTo } from "readline";


export default async function Home() {
  return(
    <Link href={"/epi-list"}><button style={{cursor:"pointer"}}>Liste des EPIs</button></Link>
  )
}
