# virtual-classroom-backend

## Features

- Basic JWT authentication
- Basic CRUD operations for classes
- Websocket for real-time communication

## Project setup

```bash
yarn
```

## Create .env file

```bash
cp .env.example .env
nano .env
```

## Compiles and hot-reloads for development

```bash
yarn dev
```

## Compiles and run for production

```bash
docker build -t virtual-classroom-backend .
docker run -d -p 4000:4000 virtual-classroom-backend
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
