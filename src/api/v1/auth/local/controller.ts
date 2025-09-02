import { Response } from 'express';
import { AuthService } from './service';
import { IRequestUser } from '../../../../middleware/authMiddleware';


export class AuthController {
    public citizenRegister (req:IRequestUser, res:Response):void{
        try{
            const token = req.token as string;
            const register = new AuthService(req.body, res, token);
            register.citizenRegister();
        }catch(error){
            throw error as Error;
        }
    }
    public login (req:IRequestUser, res:Response):void{
        try{
            const token = req.token as string;
            const login = new AuthService(req.body, res, token);
            login.login();
        }catch(error){
            throw error as Error;
        }
    }
    public logout (req:IRequestUser, res:Response):void{
        try{
            const token = req.token as string;
            const logout = new AuthService(req.body, res, token);
            logout.logout();
        }catch(error){
            throw error as Error;
        }
    }
}