import { date } from "zod/v4";
import { AppError } from "../utils/app-error.util";
import { UserRepository } from "../repositories/user.repository";
import { count } from "console";
import { comparePassword } from "../utils/password.util";
import { randomUUID } from "crypto";


const ipAttempts= new Map<string,{count:number,until:number}>();
const MAX_IP_ATTEMPS = 10;
const IP_LOCKOUT_MS = 15 * 60 * 1000;
const MAX_USER_ATTEMPS= 3;
const USER_LOCKOUT_MS= 15 * 60 * 1000;

export class AuthorService{

    private readonly userRepository:UserRepository

    async login(email:string, password:string,ip:string){
        const ipEntry=ipAttempts.get(ip);
        if(ipEntry && ipEntry.until>Date.now()){
            const remaining = Math.ceil((ipEntry.until-Date.now())/6000)
            throw new AppError(
                        `Demasiados intentos desde esta dirección. Intenta en ${remaining} min.`,
                        429,
                        "IP_BLOCKED",

            );
        }
        const user = await  this.userRepository.findByEmail(email);
        const recordIpFail=()=>{
            const e = ipAttempts.get(ip)??{count:0, until:0};
            e.count++;
            if(e.count>=MAX_IP_ATTEMPS){
                e.until= Date.now()+IP_LOCKOUT_MS;
                e.count= 0;
            }
            ipAttempts.set(ip,e);
        };
        if(!user || !user.isActive){
            recordIpFail();
            throw new AppError('Credenciales invalidas')
        }
        if(user.lockedUntil && user.lockedUntil > new Date()){
            const remaining = Math.ceil((user.lockedUntil.getTime()-Date.now())/60000);
            throw new AppError(`Usuario bloqueado intenta denuevoen ${remaining}`)
        };
        const isValid= await comparePassword(password, user.passwordHash)
        if(!isValid ){
            recordIpFail();
            user.failedAttempts=(user.failedAttempts??0)+1;
            if(user.failedAttempts>=MAX_USER_ATTEMPS){
                user.lockedUntil = new Date(Date.now()+USER_LOCKOUT_MS);
                user.failedAttempts= 0;
                await this.userRepository.save(user);
                throw new AppError(`Cuentya bloqueada por 15 minutos spor demasiado sintentos fallidos`,423,"ACCOUNT LOCKED")
            };
        
        await this.userRepository.save(user);
        const remaining = MAX_USER_ATTEMPS - user.failedAttempts;
        throw new AppError(`Credenciales invalidas, te quedan ${remaining} intentos`, 401,"INVALID_CREDENTIALS");
        }
        const sessionToken = randomUUID();
        user.failedAttempts=0;
        user.lockedUntil= null;
        user.sessionToken= sessionToken;
        await this.userRepository.save(user);
        
        ipAttempts.delete(ip);
        const token= signToken({userId:user.id,})
    
    }
    
        
}