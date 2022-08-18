import { User } from "../models/user-model";

export interface UserDtoInterface{
    firstName: String;
    lastName: string;
    gender: string;
    username: string;
    age: number;
    password?: string;
}
export function generateUserDTO(userObj: User): UserDtoInterface{
    return {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        gender: userObj.gender,
        username: userObj.username,
        age: userObj.age
    }
}