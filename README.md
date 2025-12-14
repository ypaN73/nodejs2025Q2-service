# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Node.js 22.14+ (для локальной разработки)

## Downloading

```
git clone https://github.com/ypaN73/nodejs2025Q2-service.git
```
```
cd nodejs2025Q2-service
```

## Git change branch

```
git checkout dev-3
```

## 1. Installing NPM modules:

```
npm install
```

## 2. Set up the environment:

```
cp .env.example .env
```

## 3. Set up the database:

Make sure PostgreSQL is running and accessible at the address specified in DATABASE_URL.

Run the following commands to create the schema:

```
npx prisma db push --force-reset
npx prisma generate
```

## 4. Launch the application:

```
# Development mode (with hot reload)
npm run start:dev

# Or build and run the production version:
npm run build
npm run start:prod
```

Open in browser: http://localhost:4000

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests with authorization

```
npm run test:auth
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
