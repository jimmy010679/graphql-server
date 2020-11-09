# GraphQL (use Node.js + Express)

## 測試用

### Packages

1. express
2. graphql
3. express-graphql
4. sqlite3 (讀取本地 Database)
5. cors (處理 CORS)

### 步驟

1. `git clone https://github.com/jimmy010679/graphql-server`
2. `cd graphql-server`
3. `npm install`
4. `node index.js`
5. `http://localhost:4000/graphql`

### Query books all list

```
query {
  booksAll {
    sid
    name
    author
    cover
  }
}
```

### Query books page 1 / limit 20

```
query {
  booksPage(page: 1) {
    sid
    name
    author
    cover
  }
}
```

### Query sid

```
query {
  book(sid: 74171) {
    sid
    name
    author
    cover
  }
}
```

### POST

```
method: post
url: http://localhost:4000/graphql
data:
  query {
    book(sid: 74171) {
      sid
      name
      author
      cover
    }
  }

```

https://blog.jscrambler.com/build-a-graphql-api-with-node/
