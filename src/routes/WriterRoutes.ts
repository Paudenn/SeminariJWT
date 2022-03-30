import {Request, Response, Router} from 'express';
import Writer from '../models/Writer';
import {authJwt} from '../middlewares/index';
import { ROLES } from '../models/Role';

class UserRoutes{

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public async getWriters(req: Request, res: Response): Promise<void> {
        const writers = await Writer.find().populate(`posts`, '-_id -__v');
        res.status(200).send(writers);
    }

    public async getUser(req: Request, res: Response): Promise<void> { 
        
        const user = await Writer.findOne({username: req.params.username}).populate('posts', '-_id -__v');
        //const user: User | null = await UserModel.findOne({ username: req.params.username}).populate('posts', '-_id -__v');
        res.json(user);
    }

    public async createWriter(req: Request, res: Response) { 
        const newUser = new Writer(req.body);
        await newUser.save();
        res.json({data: newUser});
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const {username} = req.params;
        const user = await Writer.findOneAndUpdate({username}, req.body, {new: true});
        res.json(user);
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const {username} = req.params;
        await Writer.findOneAndDelete({username});
        res.json({response: 'User Deletedd successfully'});
    }

    routes() {
        this.router.get('/', this.getWriters);
        this.router.get('/:username', authJwt.verifyToken, this.getUser);
        this.router.post('/', [authJwt.verifyToken, authJwt.isModerator], this.createWriter);
        this.router.put('/:username',[authJwt.verifyToken, authJwt.isModerator], this.updateUser);
        this.router.delete('/:username',[authJwt.verifyToken, authJwt.isAdmin], this.deleteUser);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;