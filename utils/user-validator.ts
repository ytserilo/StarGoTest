import { User } from "../models/user-model";
import { AbstractValidator } from "./user-validator-interface";
type Result = [boolean, string | null];

export class UserValidator extends AbstractValidator{
    async validateUsername(username: string): Promise<Result>{
        const [valid, message] = this.validateName(username, "username");
        if(!valid){
            return [valid, message];
        }

        const user = await User.findOne({where: {username: username}});
        if(user){
            return [false, "Current username is not available"];
        }
        else{
            return [true, null];
        }
    }
}