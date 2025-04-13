"use server"
import {createUser, readUsers, updateUser, deleteUser} from "@/models/userModel"
import {createSession, readSessions, updateSession, deleteSession} from "@/models/sessionsModel"
// import { setCookie, getCookie } from 'cookies-next/client';
import { cookies } from 'next/headers';
// import { get } from "http";


type FormState =
  | {
      error?: {
        message?:string
      }
      message?: string,
      GUID?: string
    }
  | undefined

export default async function login(state:FormState, formData: FormData) {
    const userName : string = formData.get('utilisaeur') as string
    const password : string = formData.get('motDePass') as string
    const cookies = formData.get('cookies')


    if(!userName || !password){
        return {
            error: {message:"Merci de remplir le nom d'utilisateur et le mot de pass"}
        }
    }

    if(!cookies){
        return {
            error: {message:"Merci d'accepter les cookies de conexion"}
        }
    }

    var GUID = await readUsers({
        Id: userName,
        pswd: password
    })
    
    if(!GUID[0]){
        return {
            error: {message:"Utilisateur ou mot de pass incorrect"}
        }
    }

    const sessionGUID = await createSession({userConcerned: GUID[0].Id})

    if(!sessionGUID){
        return {
            error: {message:"Erreur de creation de session"}
        }
    }else{
        await getSessionInCookies(sessionGUID)
    }
    
    
    
    return {GUID: sessionGUID}

}

async function getSessionInCookies(session:string){
    const cookieStore = await cookies()
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
  })
}