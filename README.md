# Installation

After clone:

```
yarn
```

or if using npm
 
```
npm install
```

# Run
```
# run project in dev mode
yarn start
# run linter
yarn lint
# run tests, test a runing in a watch mode by default so you maybe need to press a after first run
yarn test
```

Optional: you can create .env file to provide api key for FX rates service:

Create .env in ./exchange folder with content:
```
REACT_APP_FX_KEY=796753f05ea44892b79b8594451e0c71
```

If no env var will be provided it will use mock api 

## Notes

It was completed using TypeScript + React + Redux using TDD with acceptance tests and minimum required implementation to satisfy tests (test is collocated with the app so tests are in App.test.tsx);

During styling I have try to match Revolut web page UI but referencing functionality from the iOS app;  

Also there are no confirmation on exchange completion - in real life we probably want a redirect to transaction history page   
 