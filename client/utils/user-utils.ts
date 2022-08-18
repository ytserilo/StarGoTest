import { AbstractValidator } from "../../utils/user-validator-interface";

export interface UserData{
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    username: string | null;
    age: number | null;
    password?: string | null;
}

function parseJwt (token: string): UserData | null{
    try{
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        const userData: UserData = JSON.parse(jsonPayload);
        
        return userData;
    }catch{
        return null;
    }
};

export function getUser(): UserData | null{
    let accessToken = localStorage.getItem("accessToken");
    if(accessToken == null){
        return null;
    }
    return parseJwt(accessToken);
}

export class UserValidator extends AbstractValidator{
    async validateUsername(username: string): Promise<[boolean, string | null]> {
        let [res, message] = this.validateName(username, "username");
        if(!res){
            return [res, message];
        }

        const response = await fetch(`/api/get_user_by_username?username=${username}`, {
            method: "GET"
        });
        const {result} = await response.json();
        if(result){
            return [false, "This username is not available"];
        }
        return [true, null];
    }
}