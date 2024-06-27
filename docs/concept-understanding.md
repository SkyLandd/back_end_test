# Concept Understanding - Scope and Assumptions

"Treasure Hunt" is an adventurous mobile game in which players navigate through themed maps (virtual environments) to hunt for hidden treasures.

**Idea:** The game encourages exploration, strategy, and competition as players aim to collect the most valuable treasures and climb the leaderboards.

---

### **Treasure Collection**

I assume that treasure collection involves players exploring virtual maps to find treasures. This exploration could be implemented through a combination of **random treasure placements** and **player actions** such as achieving daily logins or reaching milestones. Due to the nature of the game, several assumptions are made:

- **Random Distribution**: Treasures are randomly distributed across different virtual locations. This randomness ensures fairness and replayability.
- **Daily/Weekly Limits**: Limits are imposed on the number of treasures a player can collect daily and weekly to maintain balance and prevent exploitation. Assuming this is central to the game and not personalized for the players, so in the implementation it will be a setting and will remain same for all players. 
- **Secure Collection**: The collection process ensures that each treasure can only be collected once per player, preventing duplication or cheating.
- **Trading of Treasures**: Assuming the trades do not decrease or increase the daily limit of either participants, This can be argued and based on game objective it can be decided. I am choosing to keep it consistent so that game economy remains consistent and the tradng is not exploited to get an excessive collection of treasures. 

Assuming treasures can be of different types based on their rarity, I am proposing the following categories (inspired by Clash Royale Cards):

1. Common
2. Rare
3. Epic
4. Legendary

---

### **Gameplay Mechanics:**

> Note: Highlighting the scope of this problem and assumptions to reach to solution and make sense of the problem based my understanding.

- **[Assumption - Exists in the System] Exploration**: Players navigate through different maps and environments (e.g., forests, caves, ancient ruins) to find treasures.
- **[Scope] Treasure Collection**: Players find and collect treasures hidden in various locations. The treasures have different values and rarities.
- **[Assumption - Exists in the System] Quests and Challenges**: Players can undertake quests and challenges to earn special treasures and rewards.
- **[Scope] Trading**: Players can trade treasures with each other to complete their collections or gain more valuable items.
- **[Scope] Leaderboard**: A competitive leaderboard ranks players based on the number of treasures collected. (This could be extended to value leaderboards - where they are ranked based on the value of treasure - Not in current scope)
- **[Scope] Daily/Weekly Limits**: To ensure fairness and prevent excessive grinding, there are limits on how many treasures a player can collect daily and weekly.