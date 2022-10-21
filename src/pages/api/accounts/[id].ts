import {NextApiResponse} from 'next';
import {authenticatedApi, authorizedApi} from '../../../services/auth/server-side-auth';
import {getAccount} from '../../../services/database/accounts';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {badRequest, forbidden, internalServerError} from '../../../services/utils/handle-error';
import {WithAccount} from '../../../types/accounts';

export default authenticatedApi(() => buildApiHandler({
    async get(req, res: NextApiResponse<WithAccount>) {
        try {
            const id = Number(req.query.id);

            if (isNaN(id)) {
                return badRequest(res);
            }

            const account = await getAccount(Number(id));

            if (!await authorizedApi(req, account.userId)) {
                return forbidden(res);
            }

            return res.send({
                account
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve accounts');
        }
    }
}));
