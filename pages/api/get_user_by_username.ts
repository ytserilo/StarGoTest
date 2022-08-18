import { Request, Response } from 'express'
import { User } from '../../models/user-model';

export default async function handler(req: Request, res: Response): Promise<Response>{
    let username = req.query.username as string;
    if(username == undefined){
        username = "";
    }
    const userObj = await User.findOne({where: {username: username}});
    return res.json({result: userObj == null ? false : true});
}