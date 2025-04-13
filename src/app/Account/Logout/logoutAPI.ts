"use server"
import { cookies } from 'next/headers';
import {deleteSession} from "@/models/sessionsModel"

export async function removeUser() {
    const cookieStore = await cookies()
    const sessionGUID: string = cookieStore.get("session")?.value as string

    deleteSession(sessionGUID)

    cookieStore.delete("session")
 }