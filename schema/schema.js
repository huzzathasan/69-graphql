"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const graphql_yoga_1 = require("graphql-yoga");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
exports.schema = (0, graphql_yoga_1.createSchema)({
    typeDefs: `#graphql
    type User{
        id: String
        name: String!
        email: String!
        username: String
        isVerified: Boolean
        posts: [Post]!
    }
    type Post {
        id: String
        title: String
        authorId: String!
        author: User!
        image: String
        paragraph: String
        createdAt: String
        updatedAt: String
    }

    type Query{
        hello: String!
        users: [User]!
        user(byId: String!): User
        posts: [Post]!
        post(byId: String): Post!
    }

    input UserCreateInput{
        name: String!
        email: String!
        username: String
        password: String!
    }

    input UpdateUserInput{
        name: String
        email: String
        username: String
        password: String
    }

    input PostCreateInput{
        title: String!
        authorId: String!
        image: String!
        paragraph: String!
    }
    input PostUpdateInput{
        title: String
        authorId: String!
        image: String
        paragraph: String
    }


    type Mutation{
        createUser(input: UserCreateInput!): User!
        updateUser(input: UpdateUserInput!): User
        deleteUser(byId: String!): String
        ##
        createPost(input: PostCreateInput!): Post 
        updatePost(byId: String!, input: PostUpdateInput!): Post
        deletePost(byId: String!): String
    }

    `,
    resolvers: {
        Query: {
            // USER QUERY RESOLVERS
            hello: () => {
                return "World";
            },
            users: () => __awaiter(void 0, void 0, void 0, function* () {
                const users = yield prisma.user.findMany({
                    orderBy: {
                        name: "asc",
                    },
                    include: {
                        posts: true,
                        _count: true,
                    },
                });
                return users;
            }),
            user: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId }) {
                const user = yield prisma.user.findUnique({
                    where: {
                        id: byId,
                    },
                    include: {
                        posts: true,
                        _count: true,
                    },
                });
                if (!user) {
                    console.log("Something went wrong");
                }
                return user;
            }),
            // POST QUERY RESOLVERS
            posts: () => __awaiter(void 0, void 0, void 0, function* () {
                const users = yield prisma.post.findMany({
                    orderBy: { createdAt: "asc" },
                    include: {
                        author: true,
                    },
                });
                return users;
            }),
            post: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId }) {
                const post = yield prisma.post.findUnique({
                    where: {
                        id: byId,
                    },
                    include: {
                        author: true,
                    },
                });
                if (!post) {
                    return null;
                }
                return post;
            }),
        },
        Mutation: {
            // USER MUTATION RESOLVERS
            createUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
                const id = (0, uuid_1.v4)();
                const password = yield (0, bcrypt_1.hash)(input.password, 10);
                const createUser = yield prisma.user.create({
                    data: {
                        id: id,
                        name: input.name,
                        email: input.email,
                        password: password,
                        username: input.password,
                        isVerified: false,
                    },
                });
                return createUser;
            }),
            updateUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId, input }) {
                const password = yield (0, bcrypt_1.hash)(input.password, 10);
                const updateUser = yield prisma.user.update({
                    where: {
                        id: byId,
                    },
                    data: {
                        email: input.email,
                        name: input.name,
                        password: password,
                        username: input.password,
                        isVerified: input.isVerified,
                    },
                });
                return updateUser;
            }),
            deleteUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId }) {
                const user = yield prisma.user.findUnique({
                    where: {
                        id: byId,
                    },
                });
                if (user) {
                    yield prisma.user.delete({
                        where: {
                            id: byId,
                        },
                    });
                    return `Success to delete user ${user.id}`;
                }
                return `Something went wrong`;
            }),
            // POST MUTATION RESOLVERS
            createPost: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
                const id = (0, uuid_1.v4)();
                const createdUser = yield prisma.post.create({
                    data: {
                        id,
                        title: input.title,
                        image: input.image,
                        paragraph: input.paragraph,
                        authorId: input.authorId,
                    },
                });
                return createdUser;
            }),
            updatePost: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId, input }) {
                const updatedPost = yield prisma.post.update({
                    where: {
                        id: byId,
                        authorId: input.authorId,
                    },
                    data: {
                        title: input.title,
                        paragraph: input.paragraph,
                        image: input.image,
                    },
                });
                return updatedPost;
            }),
            deletePost: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { byId }) {
                yield prisma.post
                    .delete({
                    where: {
                        id: byId,
                    },
                })
                    .catch(() => {
                    return "Deleted";
                })
                    .catch((e) => {
                    console.log(e);
                    return "Error";
                });
            }),
        },
    },
});
