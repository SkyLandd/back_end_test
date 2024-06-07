# Game Backend Test

## Objective
To assess your backend development skills relevant to game development using Node.js...

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

Good luck! We look forward to reviewing your submission.

**Deadline: 06/06/2024.**
