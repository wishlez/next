import {NextApiHandler} from 'next';
import {createUser} from '../../../services/users';
import {error} from '../../../services/utils/logger';

const handler: NextApiHandler = async (req, res) => {
    try {
        await createUser({
            login: req.body.login,
            name: req.body.name,
            password: req.body.password
        });

        res.redirect('/auth/sign-in');
    } catch (err) {
        error(err.message);

        res.redirect('/auth/sign-up?error=CreateAccount');
    }
};

export default handler;
