"use server"
import {removeUser} from './logoutAPI'
// import { useEffect } from 'react';

export default async function page(){
    
    
    // async function delSession(){
        // }
        // const cookieStore = await cookies()
        // cookieStore.delete('session')
        // useEffect(() => {
            removeUser()
        // },[]);
        
        return <div>Logout</div>
}
    
 
// async function getSessionInCookies(session:string){
    //     const cookieStore = await cookies()
    //     const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    
    // }
    
//     const logout = async ()=>{
//         const cookieStore = await cookies()
//         // remove stored token
//     cookieStore.clear("session")
//  }
