import { Request, Response } from 'express'
import { UserController } from '../../controllers/user-controller';

export default function handler(req: Request, res: Response): Promise<Response>{
    const userController = new UserController();
    return userController.login(req, res);
}