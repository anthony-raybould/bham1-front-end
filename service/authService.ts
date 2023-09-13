import type { Login } from "../model/auth";
import axios from "axios";

export const login = async function (login: Login): Promise<string> 
{
    try{
        const response = await axios.post("http://localhost:8080/api/login", login)
        if(response.status === 200)
        {
            return response.data
        }
    }
    catch(e){
        if(e.response.status === 401)
        {
            throw new Error("Invalid credentials - 401")
        }
        else if(e.response.status === 500)
        {
            throw new Error("Internal server error - 500")
        }
        throw new Error("could not login - " + e.response.status)
    }
}
