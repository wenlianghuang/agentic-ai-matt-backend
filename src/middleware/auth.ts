import {Request,Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.TOKEN_SECRET || 'default_secret', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        (req as any).user = user;
        next();
    });
}