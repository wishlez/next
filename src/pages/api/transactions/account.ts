import {NextApiResponse} from 'next';
import {authenticatedApi} from '../../../services/auth/server-side-auth';
import {getTransactionsByIds, updateTransactionsAccount} from '../../../services/database/transactions';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {forbidden, internalServerError} from '../../../services/utils/handle-error';

export default authenticatedApi((user) => buildApiHandler({
    async patch(req, res: NextApiResponse<Record<'count', number>>) {
        try {
            const ids: number[] = req.body.ids;
            const accountId: number = req.body.accountId;
            const type = req.body.type as 'from' | 'to';

            const transactions = await getTransactionsByIds(ids);

            if (transactions.some((transaction) => user.id !== transaction.userId)) {
                return forbidden(res);
            }

            const {count} = await updateTransactionsAccount(ids, `${type}AccountId`, accountId);

            return res.send({count});
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve transactions');
        }
    }
}));
