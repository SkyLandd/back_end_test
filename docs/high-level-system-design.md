# High-Level Design

The game system (As per scope of the problem statement) consists of the below modules:

### 1. Authentication Module/Service [More about authentication module on this page](authentication-module.md)

**Responsibilities:**

- User registration
- User login
- Request authentication
- Password hashing
- Email verification

### 2. Game Module [More about game module on this page](game-module.md)

**Responsibilities:**

- Managing virtual maps
- Random treasure placements
- Game logic implementation
- Quests and challenges (assumed but not developed - might need another module where game module being an orchestrator)
- Exploration mechanics (assumed but not developed - might need another module where game module being an orchestrator)

### 3. Treasure Module [More about treasure module on this page](treasure-module.md)

**Responsibilities:**

- Treasure management (types, values, rarities)
- Handling treasure collection
- Ensuring secure collection (preventing duplication or cheating)
- Storing treasure attributes (e.g., common, rare, epic, legendary)
- Daily/weekly limits management on treasure collection

### 4. User Module [More about user module on this page](user-module.md)

**Responsibilities:**

- Managing player-related information
- Tracking treasures collected by players
- Monitoring game progress
- Handling player statistics (e.g., total treasures collected, quests completed)
- Leaderboard management
- Trading treasures between players

<img src="High Level Architecture.drawio.png" width="492" height="228" alt="High Level Architecture and components">

High Level Architecture and components

---

### High Level Db Schema:
<img src="images/Db Schema.png" width="492" height="228" alt="Db Schema">

High Level Db Schema (In Progress)
---

### Endpoints:

### 1. Authentication Module/Service

- **Endpoints:**
    - `POST /register`
    - `POST /login`
    - `POST /verify-email`
    - `POST /verify-email/send` (Authenticated)
- **Security:**
    - JWT for securing endpoints
    - bcrypt for password hashing
    - Email service for sending verification emails

[More about authentication module on this page](authentication-module.md)

### 2. Game Module

- **Endpoints:**
    - `POST /collect-treasure`
    - `GET /session`
- **Logic:**
    - Random placement of treasures
    - Handling treasure collections

[More about game module on this page](game-module.md)

### 3. Treasure Module

- **Logic:**
    - Managing different types and rarities of treasures
    - Secure treasure collection processes by validation
    - Does not directly interact with outer system. Only for seperating treasure related logic.

### 4. Player Module

- **Endpoints:**
    - `GET /player/:id`
    - `GET /player/:id/statistics`
    - `GET /leaderboard`
    - `POST /trade-treasures`
- **Logic:**
    - Managing player statistics and progress
    - Handling trading between players
    - Updating and caching leaderboard for performance