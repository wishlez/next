import {NextApiResponse} from 'next';
import {authenticatedApi, authorizedApi} from '../../../services/auth/server-side-auth';
import {getAccount, getAccountUserId} from '../../../services/database/accounts';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {badRequest, forbidden, internalServerError} from '../../../services/utils/handle-error';
import {WithAccounts} from '../../../types/accounts';

export default authenticatedApi(() => buildApiHandler({
    async get(req, res: NextApiResponse<WithAccounts>) {
        try {
            const id = Number(req.query.id);

            if (isNaN(id)) {
                return badRequest(res);
            }

            if (!await authorizedApi(req, await getAccountUserId(id))) {
                return forbidden(res);
            }

            const account = await getAccount(Number(id));

            return res.send({
                account
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve accounts');
        }
    }
}));
