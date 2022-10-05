import {NextApiHandler} from 'next';
import {methodNotAllowed} from './handle-error';

type Method = 'get' | 'post' | 'patch' | 'delete' | 'put'
type Handlers = { [key in Method]?: NextApiHandler }
type Handler = (handlers: Handlers) => NextApiHandler;

export const buildApiHandler: Handler = (handlers) => (req, res, ...rest) => {
    const handler = handlers[(req.method.toLowerCase()) as Method];

    if (!handler) {
        return methodNotAllowed(res);
    }

    return handler(req, res, ...rest);
};
