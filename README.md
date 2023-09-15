# Node TypeScript Express Project with Redis, PostgreSQL, and Docker Compose

This is a Node.js project template using TypeScript and Express.js that includes Docker Compose configuration for running Redis and PostgreSQL containers. It's designed to help you quickly set up a modern backend application with database and caching support.

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (>=14.x)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/your-node-express-project.git
   cd your-project-folder
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and configure your environment variables. Here's an example `.env` file:

   ```env
   PORT=4000
   DATABASE_URL=postgres://username:password@(localhost or container-service-name):5432/mydatabase
   REDIS_URL=redis://(localhost or container-service-name):6379
   ```

   Update the values with your desired configuration.

4. Build the TypeScript code:

   ```bash
   npm run build
   ```

5. Start the application:

   ```bash
   npm start
   ```

   Your Node.js server should now be running at `http://localhost:3000`.

## Development

During development, you can use the following npm scripts:

- `npm run start:dev`: Start the development server with auto-reloading using [nodemon](https://nodemon.io/).
- `npm run test`: Run your tests.

## Docker Compose

This project includes a Docker Compose configuration for setting up PostgreSQL and Redis containers for development and testing purposes.

To start the containers, run:

```bash
docker-compose up -d
```

To stop the containers, run:

```bash
docker-compose down
```

Make sure to update your `.env` file with the appropriate database and Redis URLs to connect to the Docker containers.

## Project Structure

```
- src/
  - controllers/       # Express route controllers
  - middleware/        # Custom middleware functions
  - data/        # Custom middleware functions
  - models/            # Data models and database schema
  - services/            # API routes
  - index.ts             # Express application setup
- __tests__/                # Test files
- .dockerignore         # Ignore files when building Docker images
- .env           # Sample environment variables
- docker-compose.yml    # Docker Compose configuration
- Dockerfile            # Docker image configuration
- nodemon.json          # Nodemon configuration
- package.json          # Node.js dependencies and scripts
- tsconfig.json         # TypeScript configuration
```

## Restore Database Dump File (Postgres)

Run this command in the folder where the Dump file is located (use bash or powershell) to restore the data into the database you created

- cat Dump.sql | Docker exec -i container-name sh psql -d database-name -U db-username -W

## Connect to docker containers to view data using these commads

### Redis commands

- docker exec -it sms_redis sh
- redis_cli

### Postgres commands

- docker exec -it container-name bash
- psql -d database-name --username=username --password

## Docker Setup Depencies

- add the folder where your source code is located to Docker Desktop > Resources > FileSharing to give docker access to your file system when building your app image

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)
