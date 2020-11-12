const express = require("express");
const cors = require("cors");
const graphql = require("graphql");
const sqlite3 = require("sqlite3").verbose();
const { graphqlHTTP } = require("express-graphql");

const app = express();
const database = new sqlite3.Database("./db.sqlite");

/* ----------------------------------------------------------------------------------------------
   GraphQL
*/
const BookType = new graphql.GraphQLObjectType({
  name: "Book",
  fields: {
    sid: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    author: { type: graphql.GraphQLString },
    category_id: { type: graphql.GraphQLInt },
    category_name: { type: graphql.GraphQLString },
    cover: { type: graphql.GraphQLString },
  },
});

var queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    booksAll: {
      type: graphql.GraphQLList(BookType),
      resolve: (root, args, context, info) => {
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT * FROM books ORDER BY sid DESC LIMIT 500;",
            function (err, rows) {
              if (err) {
                reject([]);
              }
              resolve(rows);
            }
          );
        });
      },
    },
    booksPage: {
      type: graphql.GraphQLList(BookType),
      args: {
        page: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
        },
      },
      resolve: (root, { page }, context, info) => {
        let offsetCount = (page - 1) * 20;
        return new Promise((resolve, reject) => {
          database.all(
            "SELECT * FROM books ORDER BY sid DESC limit 20 offset (?);",
            [offsetCount],
            function (err, rows) {
              if (err) {
                reject([]);
              }
              resolve(rows);
            }
          );
        });
      },
    },
    book: {
      type: BookType,
      args: {
        sid: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (root, { sid }, context, info) => {
        return new Promise((resolve, reject) => {
          database.all("SELECT * FROM books WHERE sid = (?);", [sid], function (
            err,
            rows
          ) {
            if (err) {
              reject(null);
            }
            resolve(rows[0]);
          });
        });
      },
    },
  },
});

const schema = new graphql.GraphQLSchema({
  query: queryType,
});

/* ----------------------------------------------------------------------------------------------
   CORS & graphql use
*/
const corsOptions = {
  origin: [
    "http://www.example.com",
    "http://192.168.66.165:8000",
    "http://192.168.66.165:8080",
    "http://192.168.66.165:9000",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:9000",
    "http://localhost",

    "https://gatsby.kyjhome.com/",
    "http://gatsby.kyjhome.com/",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

/* ----------------------------------------------------------------------------------------------
   Listen
*/
app.listen(4000);
