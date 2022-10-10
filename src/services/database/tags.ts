import {Prisma} from '@prisma/client';
import {Tag} from '../../types/tags';
import {getPrismaClient} from '../utils/prisma';

const prisma = getPrismaClient();

export const getTags = async (User: Prisma.UserWhereInput): Promise<Tag[]> => {
    return await prisma.tag.findMany({
        where: {
            User
        }
    });
};

export const getTag = async (id: number): Promise<Tag> => (await prisma.tag.findUnique({
    where: {
        id
    }
}));

export const createTag = async (data: Prisma.TagUncheckedCreateInput): Promise<Tag> => await prisma.tag.create({
    data
});

export const deleteTag = async (id: number): Promise<void> => {
    await prisma.tag.delete({
        where: {
            id
        }
    });
};

export const updateTag = async (data: Prisma.TagUncheckedUpdateInput): Promise<Tag> => await prisma.tag.update({
    data,
    where: {
        id: data.id as number
    }
});
