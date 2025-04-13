"use server"
import LoginForm  from "./clientComponent"
// import { getCookie } from 'cookies-next/client';
import { cookies } from 'next/headers';
import { SessionByGUID } from "@/types/session";
import {readSessions,} from "@/models/sessionsModel";

const LogForm = LoginForm


export default async function page(){
    const cookieStore = await cookies()
    const sessionGUID: string = cookieStore.get("session")?.value as string
    
    const returnedGUID  = await readSessions({
        GUID:sessionGUID
    })

    console.log(returnedGUID)

    if(sessionGUID === returnedGUID[0]?.GUID){
        return <div>Vous êtes déjà connecté</div>
    }else{
        return <LogForm/>
    }
}