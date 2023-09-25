import axios from "axios";

export default class Service{
    static async get(url: string){
        try{
            const responce = await axios.get(url);
            return responce;
        }   
        catch(e){
            console.log(e);
        }
    }
}