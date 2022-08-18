import React, { useState, useMemo } from 'react'
import { UserValidator, UserData } from '../utils/user-utils'

interface UserDataErrors{
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    age: string;
    gender: string;
}

async function prepareErrorList(data: UserData, validator: UserValidator): Promise<UserDataErrors>{
    let errors: any = {};
    for(let key in data){
        let res: boolean;
        let message: string | null;
        if(key == "username"){
            if(data.username == null){
                res = false; message = "This field is required";
            }else{
                let result = await validator.validateUsername(data.username);
                res = result[0]; message = result[1];
            }
        }
        else if(key == "password"){
            if(data.password == null){
                res = false; message = "This field is required";
            }else{
                let result = await validator.validatePassword(data.password);
                res = result[0]; message = result[1];
            } 
        }
        else if(key == "age"){
            if(data.age == null){
                res = false; message = "This field is required";
            }else{
                let result = await validator.validateAge(data.age);
                res = result[0]; message = result[1];
            }
        }
        else if(key == "gender"){
            if(data.gender == null){
                res = false; message = "This field is required";
            }else{
                let result = await validator.validateGender(data.gender);
                res = result[0]; message = result[1];
            } 
        }
        else{
            if(data.firstName == null || data.lastName == null){
                res = false; message = "This field is required";
            }
            else{
                let result = await validator.validateName(
                    key == "firstName" ? data.firstName: data.lastName,
                    key
                );
                res = result[0]; message = result[1];
            }
        }
        if(res){
            errors[key] = "";
        }else{
            errors[key] = message;
        }
        
    }
    return errors as UserDataErrors;
}

export default function AuthComponent() {
    const [UserData, setUserData] = useState<UserData>({
        firstName: null,
        lastName: null,
        username: null,
        password: null,
        age: null,
        gender: null
    });

    const [UserError, setUserError] = useState<UserDataErrors>({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        age: "",
        gender: ""
    });

    const userValidator: UserValidator = useMemo(() => {
        return new UserValidator();
    }, [])

    function firstName(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        const [res, message] = userValidator.validateName(val, "firstName");
        if(!res){
            setUserError({...UserError, firstName: message as string});
        }else{
            setUserError({...UserError, firstName: ""});
        }
        setUserData({...UserData, firstName: val})
    }
    function lastName(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        const [res, message] = userValidator.validateName(val, "lastName");
        if(!res){
            setUserError({...UserError, lastName: message as string});
        }else{
            setUserError({...UserError, lastName: ""});
        }
        setUserData({...UserData, lastName: val})
    }
    async function username(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        const [res, message] = await userValidator.validateUsername(val);
        if(!res){
            setUserError({...UserError, username: message as string});
        }else{
            setUserError({...UserError, username: ""});
        }
        setUserData({...UserData, username: val})
    }
    function password(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        const [res, message] = userValidator.validatePassword(val);
        if(!res){
            setUserError({...UserError, password: message as string});
        }else{
            setUserError({...UserError, password: ""});
        }
        setUserData({...UserData, password: val})
    }
    function age(e: React.ChangeEvent<HTMLInputElement>){
        const val = Number(e.target.value);
        const [res, message] = userValidator.validateAge(val);
        if(!res){
            setUserError({...UserError, age: message as string});
        }else{
            setUserError({...UserError, age: ""});
        }
        setUserData({...UserData, age: val})
    }
    function gender(e: React.ChangeEvent<HTMLSelectElement>){
        const val = e.target.value;
        const [res, message] = userValidator.validateGender(val);
        if(!res){
            setUserError({...UserError, gender: message as string});
        }else{
            setUserError({...UserError, gender: ""});
        }
        setUserData({...UserData, gender: val})
    }

    async function auth(){
        try{
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(UserData)
            });
            if(response.status == 200){
                const data = await response.json();
            
                localStorage.setItem("accessToken", data.accessToken);
                document.cookie = `accessToken=${data.accessToken}`;
                window.location.reload();
            }
            
        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <div>
            <div className='first-name'>
                <label>First Name</label>
                <input type="text" data-name="first-name" onChange={firstName} />
                {
                    UserError.firstName.length != 0
                    ? <span className='error-message'>{UserError.firstName}</span>
                    : undefined
                }
            </div>
            <div className='last-name'>
                <label>Last Name</label>
                <input type="text" data-name="last-name" onChange={lastName} />
                {
                    UserError.lastName.length != 0
                    ? <span className='error-message'>{UserError.lastName}</span>
                    : undefined
                }
            </div>
            <div className='username'>
                <label>Username</label>
                <input type="text" data-name="username" onChange={username} />
                {
                    UserError.username.length != 0
                    ? <span className='error-message'>{UserError.username}</span>
                    : undefined
                }
            </div>
            <div className='password'>
                <label>Password</label>
                <input type="password" data-name="password" onChange={password}/>
                {
                    UserError.password.length != 0
                    ? <span className='error-message'>{UserError.password}</span>
                    : undefined
                }
            </div>
            <div className='age'>
                <label>Age</label>
                <input type="number" data-name="age" onChange={age}/>
                {
                    UserError.age.length != 0
                    ? <span className='error-message'>{UserError.age}</span>
                    : undefined
                }
            </div>
            <div className='gender'>
                <label>Gender</label>
                <select onChange={gender} data-name="gender">
                    <option selected disabled>Choose gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
                {
                    UserError.gender.length != 0
                    ? <span className='error-message'>{UserError.gender}</span>
                    : undefined
                }
            </div>
            <button onClick={auth}>Auth</button>
        </div>
    )
}
