"use server"
import { createControl, readControls, updateControl, deleteControl } from "@/models/controlModel";
import { createEpi, readEpis, updateEpi, deleteEpi } from "@/models/epiModel";
import { EpiObject } from "@/types/epi";
import {GET} from '@/app/Account/isConnected'

type FormState =
  | {
      error?: {
        message?:string
      }
      message?: string,
      GUID?: string
    }
  | undefined

export default async function formHandler(state:FormState, formData: FormData):Promise<FormState>{
  var response:FormState = {}
  var createResponse;
  var createError;
  
  if(formData.get("table")){

    const user = await GET()

    switch (formData.get("table")){


      case "EPIs": {
        
        const epi : EpiObject ={
          Id: formData.get("Id") as string,
          typeWording: formData.get("typeWording") as string,
          brand: formData.get("brand") as string,
          model: formData.get("model") as string,
          serieNo: formData.get("serieNo") as string,
          size: formData.get("size") as string,
          lenght: 0,
          color: formData.get("color") as string,
          purchase: new Date(formData.get("purchase") as string),
          manufacture: new Date(formData.get("manufacture") as string),
          commissioning: new Date(formData.get("commissioning") as string)
        }

        if(formData.get("currentId") as string){
          try{
            createResponse = updateEpi(
              epi,
              formData.get("currentId") as string
            )

          }catch(e){
            createError = {message:"Une erreur est survenue"};
          }
        }else{
          try{
            createResponse = createEpi(
              epi
            )
          }catch(e){
            createError = {message:"Une erreur est survenue"};
          }
        }

        break;
      }



      case "Control":{
        
        if(user.isValid) {

          const control = {
            comment: formData.get("comment") as string,
            date: new Date(formData.get("date") as string) as Date,
            managerId: user.user.Id,//formData.get("managerId") as string,
            epiId: formData.get("epiId") as string,
            status: formData.get("status") as string,
          }
          const currentId = Number(formData.get("currentId") as string)
          if(currentId){
            try{
              createResponse = updateControl(
                control,
                currentId
              )
              
            }catch(e){
              createError = {message:"Une erreur est survenue"};
            }
          }else{
            try{
              createResponse = createControl(
                control
              )
              
            }catch(e){
              createError = {message:"Une erreur est survenue"};
            }
          }
        }
        break;
      }
      
    }

    createResponse ? response = {
      error: createError
    }:null
  }
  
  return response


      
        
    
}