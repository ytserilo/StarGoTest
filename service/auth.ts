import * as crypto from "crypto";
import { Token } from "../models/token-model";
import { User } from "../models/user-model";
import { TokenService, JWTTokens } from "./jwt-token-service";
import { generateUserDTO, UserDtoInterface } from './user-dto';

type ReturnAuthType = [
    {type: string, message: string, userData?: UserDtoInterface},
    JWTTokens | null
]
export class Auth{
    static async login(username: string, password: string): Promise<ReturnAuthType>{
        const userObj = await User.findOne({where: {username: username}});
        
        if(!userObj){
            return [{type: "error", message: "Incorrect username or password"}, null];
        }

        let hash = crypto.createHash('sha256');
        let passwordHash = hash.update(password);
        password = passwordHash.digest("base64");
        
        if(userObj.password != password){
            return [{type: "error", message: "Incorrect username or password"}, null];
        }
        const userDto = generateUserDTO(userObj);
        const tokens = TokenService.generateTokens(userDto);
        
        await TokenService.saveToken(userObj.id as number, tokens.refreshToken);

        return [{type: "success", message: "", userData: userDto}, tokens];
    }

    static async logout(token: string): Promise<boolean>{
        await Token.destroy({where: {refreshToken: token}});
        return true;
    }

    static async auth(userData: User): Promise<ReturnAuthType>{
        let hash = crypto.createHash('sha256');
        let passwordHash = hash.update(userData.password);
        let password = passwordHash.digest("base64");
        userData.password = password;

        const userDto = generateUserDTO(userData);
        const tokens = TokenService.generateTokens(userDto);
        
        const user = await User.create(userData);
        
        await TokenService.saveToken(user.id as number, tokens.refreshToken);

        return [{type: "success", message: "", userData: userDto}, tokens];
    }

}