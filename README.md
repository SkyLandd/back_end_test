# Game Backend Test

## Objective
To assess your backend development skills relevant to game development using Node.js.

## Background Story
Welcome to "Treasure Hunt," an exciting new mobile game where players embark on adventures to collect hidden treasures. As the backend developer, your task is to build a secure and efficient backend system to handle user authentication, manage game data, and implement complex game logic to ensure a seamless and competitive gaming experience.

## Instructions
Complete the following tasks using Node.js. Push your solutions to this repository. Ensure your code is well-commented and organized.

### Task 1: User Authentication and Game Data Management

**Objective:** Implement a secure user authentication system and manage game data with advanced game logic.

1. **User Authentication:**
    - Create an endpoint for user registration.
    - Create an endpoint for user login.
    - Secure the endpoints using JWT (JSON Web Token).
    - Hash passwords before storing them in the database.
    - Implement email verification for new users.

2. **Game Data Management:**
    - Create an endpoint for players to collect treasures and store them in the database.
    - Create an endpoint to retrieve a player's statistics, including the number of treasures collected.
    - Create an endpoint to retrieve a leaderboard showing the top players based on the number of treasures collected.
    - Implement logic to handle daily and weekly treasure collection limits.
    - Implement an endpoint for players to trade treasures with each other, ensuring transactions are secure and atomic.
    - Implement a system to track and prevent cheating, such as treasure duplication or manipulation.

**Requirements:**
- Use a Node.js framework of your choice (e.g., Express).
- Use a database (e.g., PostgreSQL, MongoDB) to store user and game data.
- Ensure endpoints are secure and only accessible by authenticated users.
- Design the database schema to support scalability and performance.

### Task 2: Performance Monitoring and Optimization

**Objective:** Implement advanced performance monitoring and optimization techniques.

1. **Logging and Monitoring:**
    - Set up logging for API requests and responses.
    - Implement detailed monitoring to track server performance metrics (e.g., response time, error rate, database query performance).
    - Implement alerting for critical issues such as downtime or high error rates.

2. **Optimization:**
    - Identify potential bottlenecks in your API and suggest optimizations.
    - Implement caching for frequently accessed data, such as the leaderboard and player statistics.
    - Optimize database queries to improve performance, especially for complex operations like treasure trading.
    - Provide a detailed report on identified bottlenecks and implemented optimizations, including before-and-after performance metrics.

**Requirements:**
- Use tools like Prometheus, Grafana, or similar for monitoring and alerting.
- Ensure the system can handle high concurrency and large volumes of data efficiently.

### Submission

- **Push your work to this repository.**

## Evaluation Criteria

- Correctness and functionality of the implemented features.
- Code quality and organization.
- Documentation clarity and completeness.
- Performance and scalability considerations.
- Security measures implemented.
- Advanced game logic implementation.
- Ability to handle complex backend requirements.


# Contributing to SkyLandd Backend Test

We welcome contributions from everyone! If you are not a collaborator but would like to contribute to this project, please follow these steps to fork the repository and submit a pull request:

## 1. Fork the Repository

1. Navigate to the main page of the repository.
2. Click the `Fork` button at the top right corner of the page.
3. This will create a copy of the repository in your GitHub account.

## 2. Clone Your Fork

1. Open your terminal or command prompt.
2. Clone your forked repository to your local machine using the following command:

    ```bash
    git clone https://github.com/your-username/back_end_test.git
    ```

3. Change into the repository directory:

    ```bash
    cd back_end_test
    ```

## 3. Create a New Branch

1. Create a new branch for your changes:

    ```bash
    git checkout -b your-branch-name
    ```

## 4. Make Changes and Commit

1. Make your desired changes to the code.
2. Stage the changes for commit:

    ```bash
    git add .
    ```

3. Commit the changes with a descriptive message:

    ```bash
    git commit -m "Description of the changes"
    ```

## 5. Push Changes to Your Fork

1. Push your changes to your forked repository on GitHub:

    ```bash
    git push origin your-branch-name
    ```

## 6. Create a Pull Request

1. Navigate to the original repository (the one you forked from).
2. Click on the `Pull requests` tab.
3. Click the `New pull request` button.
4. Select the branch you just pushed to your forked repository.
5. Fill in the details of the pull request, providing a clear title and description of your changes.
6. Click `Create pull request`.

## 7. Wait for Review

Your pull request will be reviewed by the repository maintainers. You may be asked to make additional changes before it can be merged.

Thank you for contributing!



Good luck! We look forward to reviewing your submission.

**Deadline: 15/06/2024.**
