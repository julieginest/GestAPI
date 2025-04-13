"use client"
import login from './auth'
import { useState, useEffect, useActionState } from 'react';
// import { cookies } from 'next/headers';

export default function LoginForm(){
    const [state, act, pending] = useActionState(login, undefined)
    const [cookies, setCookies] = useState<boolean>(false);

    

    return(
        <form action={act}>
            <div>
                <label htmlFor="utilisaeur">Utilisaeur:</label>
                <input id="utilisaeur" name="utilisaeur" placeholder="Utilisaeur" />
            </div>
            <div>
                <label htmlFor="motDePass">Mot de pass:</label>
                <input id="motDePass" name="motDePass" type="password" />
            </div>
            <div>
                <input id="cookies" name="cookies" type="checkbox" onChange={({target: {checked}}) => setCookies(checked)}/>
                <label htmlFor="cookies">Afin de permettre la connexion, vous acceptez <a href="/j/donnees-personnelles">le depot de cookies</a></label>
            </div>
            <button type="submit" disabled={!cookies} style={cookies ? {} : {pointerEvents:"none"}}>Se connecter</button>
            
            {state?.error?.message && <p style={{color:"red"}}>{state.error.message}</p>}
        </form>
    )

    
}

