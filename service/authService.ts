import type { Login } from "../model/auth";
import axios from "axios";
import * as dotenv from 'dotenv';

export const login = async function (login: Login): Promise<string> 
{
    dotenv.config();

    try{
        const response = await axios.post(process.env.LOCAL_HOST_API + "/api/login", login)
        if(response.status === 200)
        {
            return response.data
        }
    }
    catch(e){
        if(e.response?.status === 401)
        {
            throw new Error("Invalid credentials - 401")
        }
        else if(e.response?.status === 500)
        {
            throw new Error("Internal server error - 500")
        }
        throw new Error("could not login - An error has occured.")
    }
}
