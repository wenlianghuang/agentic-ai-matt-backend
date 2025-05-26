import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default_secret';

export function generateToken(
    payload: object,
    expiresIn: SignOptions['expiresIn'] = '1h'
) {
    const options: SignOptions = { expiresIn };
    return jwt.sign(
        payload,
        JWT_SECRET,
        options
    );
}