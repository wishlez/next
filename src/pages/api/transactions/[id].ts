import {NextApiResponse} from 'next';
import {authenticatedApi, authorizedApi} from '../../../services/auth/server-side-auth';
import {getTransaction} from '../../../services/database/transactions';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {badRequest, forbidden, internalServerError} from '../../../services/utils/handle-error';
import {WithTransactions} from '../../../types/transactions';

export default authenticatedApi(() => buildApiHandler({
    async get(req, res: NextApiResponse<WithTransactions>) {
        try {
            const id = Number(req.query.id);

            if (isNaN(id)) {
                return badRequest(res);
            }

            const transaction = await getTransaction(Number(id));

            if (!await authorizedApi(req, transaction.userId)) {
                return forbidden(res);
            }

            return res.send({
                transaction
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve transactions');
        }
    }
}));
