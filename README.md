# JWT (JSON Web Token) example

Example using jwt (JSON Web Tokens) to generate a token and access a protected route by validating it.

**For an example with logout check the branch _feature_logout_**

## Installation
Install dependencies with:

```
npm install
```
Run it with:
```
npm run dev
```

## Usage

To generate a token, make a _post_ request to:
```
http://127.0.0.1/3000/login
```
You need to provide a json object that contains at the very least a _username_, for example:
```
{
  "username": "testuser",
  "password": "1234"
}
```
This should return a JSON object with the token in the form of:
```
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjEsInVzZXJuYW1lIjoidGVzdHVzZXIiLCJpYXQiOjE1OTE1MDM3OTAsImV4cCI6MTU5MTUwMzg1MH0.FS3Li7WEkbSkD9yoBz1ipU_GQuwRk8Y752T0lpsIBwM"
}
```
**IMPORTANT: The access token has an expiration of 5 minutes, after that you'll need to hit the _login_ route again.**

You can now use that token to access a protected route. Make a post request to the protected route passing the token in the _authorization_ header.
```
http://127.0.0.1/3000/protected
```
## Included example requests

For concrete examples check the _requests.rest_ file. In order to make use of it you need [visual studio code](https://code.visualstudio.com/) and the extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

Begin by running the ```/login``` request to generate a new valid token, then paste the token generated into the ```@TOKEN``` variable, with this you should have access to the protected route.