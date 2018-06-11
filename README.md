# React Git Explorer

* This app aim
  * To use the apollo graphql client to extract github data via its GraphQL APIs
  * Infinite scroll where github project cards will be displayed.

## setup

```bash
yarn install
```

## environment setup

Add the app github OAuth Client ID, Redirect URI and GitKeeper URI to .env.development.local

```
REACT_APP_CLIENT_ID=<GITHUB OAUTH TOKEN>
REACT_APP_REDIRECT_URI=<DEPLOYED APP URI>
REACT_APP_GITKEEPER_URI=<GITKEEPER HEROKU APP URI>
```

Sample URIs
```
REACT_APP_REDIRECT_URI=https://affectionate-keller-d4f61b.netlify.com/
REACT_APP_GITKEEPER_URI=https://gitexplorer-gatekeeper.herokuapp.com
```

## run

```bash
yarn start
```

## build in production mode

```bash
yarn build
```

### Sample screenshot

![image](public/snapshot.PNG)

