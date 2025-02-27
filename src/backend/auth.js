import conf from "../conf/conf";
import { Client,ID,Account } from "appwrite";
import service from "./config";
export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email,password,name}){
        // console.log(conf)
        // console.log(import.meta.env.VITE_APPWRITE_URL);

        try {
            const userAccount = await this.account.create(ID.unique(),email,password,name);
            
            if(userAccount)
            {
                // console.log(userAccount.$id,userAccount.email)
                const doc = await service.setUserDetails(userAccount.$id,userAccount.email)
                return this.login({email,password});
            }
        } catch (error) {
            throw(error)
        }
    }

    async login({email,password}) {
          try {
             return await this.account.createEmailPasswordSession(email , password);
          } catch (error) {
            throw(error);
          }
    }

    async getCurrentUser() {
        try{
            return await this.account.get()
        }
        catch(error)
        {
            throw(error)
        }
        return null;
    }
     
    async logout() {
        try {
            return this.account.deleteSessions();
        } catch (error) {
            throw(error)
        }
    }
}

const authService = new AuthService();

export default authService