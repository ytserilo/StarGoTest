import { useRouter } from 'next/router';
import React, {useEffect, useState} from 'react';
import { customFetch } from '../../client/custom-fetch';

interface UserInfo{
    firstName: string;
    lastName: string;
    gender: string;
    age: string;
    username: string;
}

export default function GetUser(){
    const [userInfo, setUserInfo] = useState<UserInfo | null>();
    const {query} = useRouter();

    useEffect(() => {
        if(query == null){
            return;
        }
        customFetch(`/api/get/${query.id}`, "GET").then((result) => {
            setUserInfo(result as UserInfo);
        }).catch(() => {
            localStorage.setItem("accessToken", "");
            window.location.reload();
        })  
    }, [query]);

    return <div>
        {
            userInfo
            ?<React.Fragment>
                <p>FirstName: {userInfo.firstName}</p>
                <p>LastName: {userInfo.lastName}</p>
                <p>Gender: {userInfo.gender}</p>
                <p>Age: {userInfo.age}</p>
                <p>username: {userInfo.username}</p>
            </React.Fragment>
            : <span>Loading...</span>
        }
        
    </div>
}