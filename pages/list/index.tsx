import Link from 'next/link'
import {useEffect, useState} from "react";
import { customFetch } from '../../client/custom-fetch';

interface UserObj{
    id: number;
    firstName: string;
    lastName: string;
}

const ListPage = () => {
    const [UserList, setUserList] = useState<UserObj[]>([]);
    useEffect(() => {
        customFetch("/api/list", "GET").then((result) => {
            setUserList(result as UserObj[]);
        }).catch(() => {
            localStorage.setItem("accessToken", "");
            window.location.reload();
        })   
    }, [])

    return <div>
        <h1>User list</h1>
        <ul>
            {
                UserList.map((item: UserObj) => {
                    const link = `/get/${item.id}`;
                    return <li><Link href={link}>
                        <a>{item.firstName + " " + item.lastName}</a>
                    </Link></li>
                })
            }
        </ul>
        
    </div>
}
  

export default ListPage;