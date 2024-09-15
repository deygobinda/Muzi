import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export const userClient = prismaClient.user;
export const streamClient = prismaClient.stream;
export const upvoteClient = prismaClient.upvote;