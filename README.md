# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker 20.10+
- Docker Compose 2.0+
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
git checkout dev
```

## Installing NPM modules

```
npm install
```

## Start the application:

```
docker-compose up --build
```

## Apply database migrations:

```
docker-compose exec app npx prisma migrate dev --name init
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

To run all tests without authorization

```
npm run test
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
