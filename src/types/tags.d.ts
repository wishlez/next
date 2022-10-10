import type {Tag as PrismaTag} from '@prisma/client';

export type Tag = PrismaTag;

export type WithTag<P = Record> = P & {
    tag: Tag
};

export type WithTags<P = Record> = P & {
    tags: Tag[]
};

export type TagRequest = Omit<Tag, 'id' | 'userId'>;
