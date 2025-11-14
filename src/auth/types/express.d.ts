import { AuthUser } from 'src/auth/types/auth-user';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

export {};
