"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const http_1 = require("http");
const schema_1 = require("./schema/schema");
const yoga = (0, graphql_yoga_1.createYoga)({
    schema: schema_1.schema,
    graphiql: {
        defaultQuery: /* GraphQL */ `
      query {
        hello
      }
    `,
    },
});
const server = (0, http_1.createServer)(yoga);
const port = 3000;
server.listen(port, () => {
    console.info(`\x1b[31m📢 Yoga Serer Is Ready at 👉\x1b[4m http://localhost:${port}/graphql`, "\x1b[0m");
});
