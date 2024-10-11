import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { schema } from "./schema/schema";

const yoga = createYoga({
  schema: schema,
  graphiql: {
    defaultQuery: /* GraphQL */ `
      query {
        hello
      }
    `,
  },
});
const server = createServer(yoga);

const port = 3000;
server.listen(port, () => {
  console.info(
    `\x1b[31m📢 Yoga Serer Is Ready at 👉\x1b[4m http://localhost:${port}/graphql`,
    "\x1b[0m"
  );
});
