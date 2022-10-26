import {NextApiResponse} from 'next';
import {authenticatedApi} from '../../../services/auth/server-side-auth';
import {getTransactionsByIds, updateTransactionTags} from '../../../services/database/transactions';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {forbidden, internalServerError} from '../../../services/utils/handle-error';
import {AdjustedOptions} from '../../../types/options';

export default authenticatedApi((user) => buildApiHandler({
    async patch(req, res: NextApiResponse<Record<'count', number>>) {
        try {
            const ids: number[] = req.body.ids;
            const tags: AdjustedOptions = req.body.tags;

            const transactions = await getTransactionsByIds(ids);

            if (transactions.some((transaction) => user.id !== transaction.userId)) {
                return forbidden(res);
            }

            const {length: count} = await updateTransactionTags(ids, tags);

            return res.send({count});
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve transactions');
        }
    }
}));
