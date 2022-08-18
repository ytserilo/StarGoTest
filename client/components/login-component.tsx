import React, {useState} from 'react'

export default function LoginComponent() {
    const [LoginParams, setLoginParams] = useState<{username: string, password: string}>({
        username: "", password: ""
    });
    const [Error, setError] = useState<string>("");

    function username(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        setLoginParams({...LoginParams, username: val});
    }
    function password(e: React.ChangeEvent<HTMLInputElement>){
        const val = e.target.value;
        setLoginParams({...LoginParams, password: val});
    }

    async function login(){
        if(LoginParams.username == "" || LoginParams.password == ""){
            setError("Please fill all inputs");
            return;
        }
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(LoginParams)
        });
        if(response.status != 200){
            setError("Incorrect username or password");
            return;
        }
        const result = await response.json();
        localStorage.setItem("accessToken", result.accessToken);
        document.cookie = `accessToken=${result.accessToken}`;
        window.location.reload();
        
    }
    return (
        <div>
            <label>Username</label>
            <input type="text" onChange={username}/>
            <label>Password</label>
            <input type="password" onChange={password}/>
            {
                Error.length != 0
                ? <span className='error-message'>{Error}</span>
                : undefined
            }
            <button onClick={login}>Login</button>
        </div>
    )
}
