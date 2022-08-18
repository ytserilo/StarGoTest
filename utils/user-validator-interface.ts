const GENDERS = ["male", "female"];
type Result = [boolean, string | null];

export abstract class AbstractValidator{
    validateName(name: string, fieldName: string): Result{
        if(name.length < 3){
            return [false, `${fieldName} must be more then 3 chars`];
        }
        else if(name.length > 60){
            return [false, `${fieldName} must be less then 60 chars`];
        }
        else{
            return [true, null];
        }
    }

    validatePassword(password: string): Result{
        const reg = new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g);
        const res = Boolean(password.match(reg));
        if(res){
            return [true, null];
        }
        else{
            return [false, "Password must be number char and up char"]
        }
    }

    validateAge(age: number): Result{
        if(age < 0){
            return [false, "Age cannot be minus"];
        }
        else if(age >= 0 && age <= 3){
            return [false, "You so young"]
        }
        else if(age > 180){
            return [false, "Age is to big"];
        }
        else{
            return [true, null];
        }
    }

    validateGender(gender: string): Result{
        let res = Boolean(GENDERS.find((item) => { return gender == item }));
        if(res){
            return [true, null];
        }else{
            return [false, "Current gender "];
        }
    }

    abstract validateUsername(username: string): Promise<Result>;
}