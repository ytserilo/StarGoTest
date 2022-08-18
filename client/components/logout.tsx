import React from 'react'

interface LogOut{
    user: boolean;
}
export default function LogOut(props: LogOut) {
    async function logout(){
        await fetch("/api/logout", {
            method: "GET"
        });
        localStorage.setItem("accessToken", "");
        window.location.reload();
    }
    return (
        <div style={{position: "fixed", top: "5px", right: "5px"}}>
            {
                props.user
                ? <button onClick={logout}>LogOut</button>
                : undefined
            }
        </div>
    )
}
