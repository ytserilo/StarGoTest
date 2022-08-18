import * as jwt from "jsonwebtoken";
import { Token } from "../models/token-model";
import { User } from "../models/user-model";
import { generateUserDTO, UserDtoInterface } from "./user-dto";

export interface JWTTokens{
    accessToken: string;
    refreshToken: string;
}

export class TokenService{
    static generateTokens(payload: UserDtoInterface): JWTTokens{
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {expiresIn: "15m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {expiresIn: "30d"});

        return {
            accessToken, refreshToken
        }
    }

    static async saveToken(UserId: number, refreshToken: string): Promise<Token | undefined>{
        try{
            var tokenObj = await Token.findOne({
                where: {UserId: UserId}
            });
        }
        catch(err){
            return;
        }
        
        if(tokenObj){
            tokenObj.refreshToken = refreshToken;
            await Token.update({refreshToken: refreshToken}, {
                where: {UserId: tokenObj.UserId}
            });
            return tokenObj;
        }
        
        return await Token.create({
            refreshToken: refreshToken,
            UserId: UserId 
        });
    }

    static validateAccessToken(token: string): UserDtoInterface | null{
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as UserDtoInterface;//process.env.JWT_ACCESS_SECRET);
            
            return userData;
        } catch (e) {
            return null;
        }
    }

    static validateRefreshToken(token: string): UserDtoInterface | null{
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as UserDtoInterface;//process.env.JWT_REFRESH_SECRET);
            
            return userData;
        } catch (e) {
            return null;
        }
    }

    static async removeToken(refreshToken: string): Promise<number>{
        const id = await Token.destroy({where: {refreshToken: refreshToken}})
        return id;
    }

    static async findToken(refreshToken: string): Promise<Token | null>{
        const tokenData = await Token.findOne({where: {refreshToken}})
        return tokenData;
    }

    static async refresh(UserId: number): Promise<JWTTokens>{
        const user = await User.findOne({where: {id: UserId}});

        const tokens = TokenService.generateTokens(generateUserDTO(user as User));
        await TokenService.saveToken(UserId, tokens.refreshToken);
        return tokens;
    }
}
