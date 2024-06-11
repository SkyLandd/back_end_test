# Introduction

This project is a backend system for a game using Node.js, Express, and Prisma with PostgreSQL. It supports running with Docker or directly on your local system.

## Getting Started
### General Steps
1. Clone the repository:
   ```
   git clone https://github.com/NastaranShabani/back_end_test.git
   ```

2. Navigate to the project root directory:
   ```
   cd back_end_test
   ```
### 1. Running with Docker
### Prerequisites
Make sure Docker is installed on your system.
### Steps

3. Run the project:
   ```
   make run
   ```
All docker containers should be up and running and there is no need for further steps
### 2. Running Locally Without Docker
### Prerequisites
Make sure PostgreSQL is installed on your system.
Install the latest version of Node.js, npm, and npx. You can install Node.js from the official website, which includes npm and npx.
### Steps
3. Install the dependencies:

    ```sh
    npm install
    ```
4. Create a PostgreSQL database on your local system.

5. Copy the example environment file and update it with your database credentials:

    ```sh
    cp .env.example .env
    ```

    Update the content of the `.env` file based on your recently created database credentials. Set HOST=localhost 
 

6. Generate Prisma client:

    ```sh
    npx prisma generate
    ```

7. Apply database migrations:

    ```sh
    npx prisma migrate dev --name init
    npx prisma migrate deploy
    ```

8. Start the project:

    ```sh
    npm start
    ```
## Postman Collection

You can find the Postman collection in the `postmanCollection/` directory.

### Initial Setup **(Necessary)**

1. Send a GET request to `/insertTreasure` to create the game treasures.

## Additional Information

### Environment Variables

Ensure that your `.env` file is correctly set up with the following variables:

```env
HOST=db
DATABASE=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
DATABASE_URL=postgresql://your_database_user:your_database_password@db:5432/your_database_name
PORT=8000

