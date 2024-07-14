# NodeJWT

## Setup for running locally
After cloning the project, first install node_modules by running `npm install`.

In order to run this project locally, you need to populate the `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` environment variables within the project's `.env` file.  You can generate these values by using the node cli like so:

```
node
require('crypto').randomBytes(64).toString('hex')
```

Copy and paste the output string from the above command into the `ACCESS_TOKEN_SECRET` environment variable in the within the project's `.env` file.  Repeat the above once more and set the generated string to the `REFRESH_TOKEN_SECRET` variable (also) found in the `.env` file.

## Running locally
In order to run locally, in two separate terminals run the following commands:

```
node server.js
node authServer.js
```

These commands will a) start a server that handles authentication and creating users listening on port 3000 and b) start a second server that is protected by authentication listening on port 4000 which serves a hardcoded dummy list of posts.  The authentication server allows you to create a user by POSTing a new user to http://localhost:3000/users with the following request body:
```
{
  "username": "bob",
  "password": "whatever"
}
```

You can then log in that user by POSTing the above request body to http://localhost:3000/users/login.  This request will give you an access token and a refresh token in the response like so (actual values will differ, but you get the idea):
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsInBhc3N3b3JkIjoiJDJiJDEwJG40d1pOZ0lRcmhXUnp3bjBKYk1ETC4xUlhBQVhSRVVMNkNCeDB1YjB4VjFRSmh5Tkk1SVpPIiwiaWF0IjoxNzIwOTA4MjcwLCJleHAiOjE3MjA5MDgyODV9.gvhJkI0XhK4fpJNYdh1nGVoXVYo7IKd25tiPgvJSTAE",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsInBhc3N3b3JkIjoiJDJiJDEwJG40d1pOZ0lRcmhXUnp3bjBKYk1ETC4xUlhBQVhSRVVMNkNCeDB1YjB4VjFRSmh5Tkk1SVpPIiwiaWF0IjoxNzIwOTA4MjcwfQ.CcPn2ySV9po5XMPY0jBF5zCZtCo1T-55kIBGlDpXI1Y"
}
```

Using the access token returned by the above request, you can then request from the "posts" server listening on port 4000 at `http://localhost:4000/posts` for the next 30 seconds.  After thirty seconds, the access token will expire and you'll need to use the value of the "refreshToken" property in order to get a new access token using the following POST body, sent to localhost:3000:
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbSIsInBhc3N3b3JkIjoiJDJiJDEwJG40d1pOZ0lRcmhXUnp3bjBKYk1ETC4xUlhBQVhSRVVMNkNCeDB1YjB4VjFRSmh5Tkk1SVpPIiwiaWF0IjoxNzIwOTA4MjcwfQ.CcPn2ySV9po5XMPY0jBF5zCZtCo1T-55kIBGlDpXI1Y"
}
```

Finally, you can log the user out by sending a DELETE request with the access token in the request body.

## GET users endpoint
For demonstration purposes, there is a `GET /users` endpoint which you can use to confirm your users are being created like you'd expect.  Obviously, in a real world application, you would NOT want to create this endpoint. 
