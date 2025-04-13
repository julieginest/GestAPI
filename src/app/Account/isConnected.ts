"use server"
import { cookies } from 'next/headers';
import { readSessions } from '@/models/sessionsModel';
import { readUsers } from '@/models/userModel';
import { UserObject } from '@/types/user';

export async function GET() : Promise<
    {isValid: false} | {isValid:true, user:UserObject}
    > {

    
    const cookieStore = await cookies();
    const sessionGUID = cookieStore.get('session')?.value as string;
    const returnedGUID  = await readSessions({
    GUID:sessionGUID
    })

    if(!returnedGUID){
        return {
            isValid:false,
        }
    }
    var returnedUser
    try{
        returnedUser = await readUsers({Id:returnedGUID[0].userConcerned})
    }catch{
        return{
            isValid:false
        }
    }
    
    if(!returnedUser){
        return {
            isValid:false,
        }
    }

    return {
        isValid:true,
        user: returnedUser[0]
    }

}