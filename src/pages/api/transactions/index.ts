import {NextApiResponse} from 'next';
import {authenticatedApi, authorizedApi} from '../../../services/auth/server-side-auth';
import {createTransaction, deleteTransaction, getTransaction, getTransactions, updateTransaction} from '../../../services/database/transactions';
import {buildApiHandler} from '../../../services/utils/build-api-handler';
import {toDateObject} from '../../../services/utils/date';
import {badRequest, forbidden, internalServerError, notFound} from '../../../services/utils/handle-error';
import {Transaction, TransactionRequest, WithTransactions} from '../../../types/transactions';

export default authenticatedApi((user) => buildApiHandler({
    async delete(req, res: NextApiResponse<Record<string, never>>) {
        const id = Number(req.query.id);

        if (isNaN(id)) {
            return badRequest(res);
        }

        const transaction = await getTransaction(id);

        if (!transaction) {
            return notFound(res);
        }

        if (!await authorizedApi(req, transaction.userId)) {
            return forbidden(res);
        }

        try {
            await deleteTransaction(id);

            return res.send({});
        } catch (err) {
            return internalServerError(res, err, 'Failed to delete transaction');
        }
    },
    async get(req, res: NextApiResponse<WithTransactions>) {
        try {
            const transactions = await getTransactions(user, Number(req.query.size), Number(req.query.page));

            return res.send({
                transactions
            });
        } catch (err) {
            return internalServerError(res, err, 'Failed to retrieve transactions');
        }
    },
    async post(req, res: NextApiResponse<Transaction>) {
        try {
            const transactionRequest: TransactionRequest = req.body;

            return res.send(await createTransaction({
                amount: transactionRequest.amount,
                date: toDateObject(transactionRequest.date),
                description: transactionRequest.description,
                fromAccountId: transactionRequest.fromAccountId,
                toAccountId: transactionRequest.toAccountId,
                userId: user.id
            }, transactionRequest.tags));
        } catch (err) {
            return internalServerError(res, err, 'Failed to create transaction');
        }
    },
    async put(req, res: NextApiResponse<Transaction>) {
        const transaction = await getTransaction(req.body.id);

        if (!transaction) {
            return notFound(res);
        }

        if (!await authorizedApi(req, transaction.userId)) {
            return forbidden(res);
        }

        try {
            const transactionRequest: TransactionRequest = req.body;

            return res.send(await updateTransaction({
                amount: transactionRequest.amount,
                date: toDateObject(transactionRequest.date),
                description: transactionRequest.description,
                fromAccountId: transactionRequest.fromAccountId,
                id: transactionRequest.id,
                toAccountId: transactionRequest.toAccountId,
                userId: user.id
            }, transactionRequest.tags));
        } catch (err) {
            return internalServerError(res, err, 'Failed to update transaction');
        }
    }
}));
