import {useRouter} from 'next/router';

type QueryValue = number | string | string[];
type BuildQuery = (queryName: string, value: QueryValue) => { query: Record<string, QueryValue> }
type GetQuery = <T extends QueryValue>(queryName: string, fallback?: T) => T;
type PushQuery = (queryName: string, value: QueryValue, shallow?: boolean) => Promise<void>;
type UpdateQuery = (queryName: string, value: QueryValue, force?: boolean) => Promise<void>;

type UseRouterQuery = () => {
    buildQuery: BuildQuery
    getQuery: GetQuery
    pushQuery: PushQuery
    updateQuery: UpdateQuery
};

export const useRouterQuery: UseRouterQuery = () => {
    const router = useRouter();

    const getQuery: GetQuery = <T extends QueryValue>(queryName: string, fallback?: T): T => {
        const param = router.query[queryName];
        const value = typeof fallback === 'number' ? Number(param) : param;

        return value as T || fallback;
    };

    const buildQuery: BuildQuery = (queryName, value) => ({
        query: {
            ...router.query,
            [queryName]: value
        }
    });

    const pushQuery: PushQuery = async (queryName, value, shallow) => {
        await router.push({
            pathname: router.pathname,
            ...buildQuery(queryName, value)
        }, undefined, {
            shallow
        });
    };

    const updateQuery: UpdateQuery = async (queryName, value, force) => {
        if (!router.query[queryName] || force) {
            await pushQuery(queryName, value, true);
        }
    };

    return {
        buildQuery,
        getQuery,
        pushQuery,
        updateQuery
    };
};
