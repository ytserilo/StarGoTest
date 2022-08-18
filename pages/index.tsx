import Link from 'next/link'
import { useEffect, useState } from "react";
import AuthComponent from '../client/components/auth-components';
import LoginComponent from '../client/components/login-component';
import LogOut from '../client/components/logout';
import { getUser, UserData } from '../client/utils/user-utils'


const IndexPage = () => {
    const [User, setUser] = useState<UserData | null>();
    const [Login, setLogin] = useState<boolean>(true);
    useEffect(() => {
        setUser(getUser());
    }, [])
    return <div>
        <LogOut user={Boolean(User)} />
        {
            User
            ? <div>
                <p>Hello dow you want to see all users</p>
                <p>Please click on the link <Link href="/list/">
                        <a>User list</a>
                    </Link>
                </p>
            </div>
            : <div>
                {
                    Login
                    ? <LoginComponent />
                    : <AuthComponent />
                }
                <div>
                    {
                        Login
                        ? <span>You don't have account please click
                            <button onClick={() => {setLogin(false)}}>Create new account</button>
                        </span>
                        : <span>You already have an account please click
                            <button onClick={() => {setLogin(true)}}>Login in exciting account</button>
                        </span>
                    }
                </div>
            </div>
        }
    </div>
}
  

export default IndexPage