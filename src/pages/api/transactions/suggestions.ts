import {NextApiResponse} from 'next';
import {authenticatedApi} from '../../../services/auth/server-side-auth';
import {getTransactionSuggestions} from '../../../services/database/transactions';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {internalServerError} from '../../../services/utils/handle-error';
import {WithTransactions} from '../../../types/transactions';

export default authenticatedApi((user) => buildApiHandler({
    async get(req, res: NextApiResponse<WithTransactions>) {
        try {
            const transactions = await getTransactionSuggestions(user);

            return res.send({
                transactions
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve transactions');
        }
    }
}));
