import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { createSchema } from "graphql-yoga";
import { v4 } from "uuid";
import {
  PostCreateInterface,
  PostUpdateInterface,
  UserCreateInterface,
  UserUpdateInterface,
} from "../types";

const prisma = new PrismaClient();

export const schema = createSchema({
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
      users: async () => {
        const users = await prisma.user.findMany({
          orderBy: {
            name: "asc",
          },
          include: {
            posts: true,
            _count: true,
          },
        });
        return users;
      },
      user: async (_: string, { byId }: { byId: string }) => {
        const user = await prisma.user.findUnique({
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
      },

      // POST QUERY RESOLVERS
      posts: async () => {
        const users = await prisma.post.findMany({
          orderBy: { createdAt: "asc" },
          include: {
            author: true,
          },
        });
        return users;
      },
      post: async (_: string, { byId }: { byId: string }) => {
        const post = await prisma.post.findUnique({
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
      },
    },
    Mutation: {
      // USER MUTATION RESOLVERS
      createUser: async (
        _: string,
        { input }: { input: UserCreateInterface }
      ) => {
        const id = v4();
        const password = await hash(input.password, 10);
        const createUser = await prisma.user.create({
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
      },
      updateUser: async (
        _: string,
        { byId, input }: { byId: string; input: UserUpdateInterface }
      ) => {
        const password = await hash(input.password, 10);
        const updateUser = await prisma.user.update({
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
      },
      deleteUser: async (_: string, { byId }: { byId: string }) => {
        const user = await prisma.user.findUnique({
          where: {
            id: byId,
          },
        });
        if (user) {
          await prisma.user.delete({
            where: {
              id: byId,
            },
          });
          return `Success to delete user ${user.id}`;
        }
        return `Something went wrong`;
      },

      // POST MUTATION RESOLVERS
      createPost: async (_, { input }: { input: PostCreateInterface }) => {
        const id = v4();
        const createdUser = await prisma.post.create({
          data: {
            id,
            title: input.title,
            image: input.image,
            paragraph: input.paragraph,
            authorId: input.authorId!,
          },
        });
        return createdUser;
      },
      updatePost: async (
        _,
        { byId, input }: { byId: string; input: PostUpdateInterface }
      ) => {
        const updatedPost = await prisma.post.update({
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
      },
      deletePost: async (_, { byId }: { byId: string }) => {
        await prisma.post
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
      },
    },
  },
});
