import { User } from "../models/user-model";
import { Auth } from "../service/auth";
import { TokenService, JWTTokens } from "../service/jwt-token-service";
import { UserValidator } from "../utils/user-validator";
import { Request, Response } from 'express'
import Cookies from 'cookies'
import { generateUserDTO } from "../service/user-dto";
import { access } from "fs";

const ACCESS_ERROR = {message: {key: "access-error", message: "Access error"}};
const BODY_ERROR = {message: {key: "body", message: "Invalid request body"}}

export class UserController{
    public async validateRegistrationBodyFields(body: any): Promise<{key: string, message: string}[]>{
        const validator = new UserValidator();
        const requireFields = [
            "username",
            "password",
            "age",
            "gender",
            "firstName",
            "lastName"
        ];
        
        let invalidBody = false;
        
        for(let i = 0; i < requireFields.length; i++){
            if(body[requireFields[i]] == undefined){
                invalidBody = true;
                break;
            }
        }
        
        if(invalidBody){
            return [{key: "body", message: "Invalid request body"}]
        }
        
        let errors: {key: string, message: string}[] = [];
        for(let i = 0; i < requireFields.length; i++){
            let key = requireFields[i];
            const value = body[key];
            if(key == "username"){
                var [res, message] = await validator.validateUsername(value);   
            }
            else if(key == "password"){
                var [res, message] = validator.validatePassword(value);
            }
            else if(key == "age"){
                var [res, message] = validator.validateAge(value);
            }
            else if(key == "gender"){
                var [res, message] = validator.validateGender(value)
            }
            else{
                var [res, message] = validator.validateName(value, key); 
            }
            
            if(!res){
                message = message as string;
                errors.push({key, message});
            }
        }

        return errors;
    }

    async registration(req: Request, res: Response): Promise<Response>{
        const errors = await this.validateRegistrationBodyFields(req.body);
        
        if(errors.length > 0){
            return res.status(500).json({message: {type: "request-body-errors", errors: errors}});
        }
        
        let [message, tokens] = await Auth.auth(req.body);
        tokens = tokens as JWTTokens;
        const cookies = new Cookies(req, res);
        cookies.set("refreshToken", tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json({
            ...message.userData,
            accessToken: tokens.accessToken
        })
    }

    async login(req: Request, res: Response): Promise<Response>{
        try {
            const {username, password} = req.body;
            let [message, tokens] = await Auth.login(username, password);
            if(message.type == "error"){
                return res.status(500).json({message});
            }
            tokens = tokens as JWTTokens;
            const cookies = new Cookies(req, res);
            cookies.set('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({
                ...message.userData,
                accessToken: tokens.accessToken
            });
        } catch (e) {
            return res.status(500).json(BODY_ERROR);
        }
    }

    async logout(req: Request, res: Response): Promise<Response>{
        try {
            const cookies = new Cookies(req, res);
            const refreshToken = cookies.get("refreshToken");
            await Auth.logout(refreshToken as string);
            cookies.set('refreshToken');
            return res.json({type: "success"});
        } catch (e) {
            return res.status(500).json(BODY_ERROR);
        }
    }

    async refresh(req: Request, res: Response): Promise<Response>{
        const cookies = new Cookies(req, res);
            const refreshToken = cookies.get("refreshToken");
            const token = await TokenService.findToken(refreshToken as string);
            if(!token){
                return res.status(500).json(BODY_ERROR);
            }
            const result = TokenService.validateRefreshToken(refreshToken as string);
            if(!result){
                return res.status(500).json(BODY_ERROR);
            }
            const tokens = await TokenService.refresh(token.UserId as number);

            cookies.set('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({
                accessToken: tokens.accessToken
            });
    }

    async getUser(req: Request, res: Response): Promise<Response>{
        try{
            const cookies = new Cookies(req, res);
            const accessToken = cookies.get("accessToken");
            if(accessToken == undefined){
                return res.status(401).json(ACCESS_ERROR);
            }
            
            const token = TokenService.validateAccessToken(accessToken);
            if(!token){
                return res.status(401).json(ACCESS_ERROR);
            }
            const user = await User.findOne({where: {id: Number(req.query.id)}})
            if(user){
                return res.status(200).json(generateUserDTO(user));
            }
            else{
                return res.status(404);
            }
        }catch{
            return res.status(500).json(BODY_ERROR);
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response>{
        try {
            const cookies = new Cookies(req, res);
            const accessToken = cookies.get("accessToken");
            
            if(accessToken == undefined){
                return res.status(401).json(ACCESS_ERROR);
            }
            const token = TokenService.validateAccessToken(accessToken);
            
            if(!token){
                return res.status(401).json(ACCESS_ERROR);
            }
            const users = await User.findAll()
            let responseUsers = [];
            for(let i = 0; i < users.length; i++){
                responseUsers.push({
                    id: users[i].id,
                    firstName: users[i].firstName,
                    lastName: users[i].lastName
                })
            }
            return res.json(responseUsers);
        } catch (e) {
            return res.status(500).json(BODY_ERROR);
        }
    }
}