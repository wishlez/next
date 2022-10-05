import {Session} from 'next-auth';

export type PageProps<P = Record> = {
    title: string,
    session?: Session
} & P;
