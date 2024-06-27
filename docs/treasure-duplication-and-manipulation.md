### **Thoughts on Security (Avoiding Duplication, Treasure manipulation):**

So when the game play happens, the game engine should generate a map (using generative procedures or predefined static maps)

Since the treasure is randomly distributed by the game engine itself - It can be an always running process which distributes treasures by generating coordinates and allocating treasures. Maybe for a fixed amount of time the treasure is present at the location to maintain randomness - for instance at time t1 → Generate coordinates of the treasures where the treasure will be placed on map, the server allocates a treasure from the predefined treasure list. Now once this is decided we can put the location (coordinate) and treasure_id in a cache for the pre-defined ttl (Time to live)

Now when the treasure collection request comes - On client we can show an immediate effect of collection to maintain latency request and in background we process the request of storing the treasure in user’s inventory. Before storing the data validate the request:

1. Based on user’s coordinate - Check if there was a treasure in the vicinity
2. If there is a treasure in cache, allow collection of the treasure id by storing the treasure in inventory, also delete the treasure from cache. (This can be done by distributed redlocks which is a locking mechanism in cache so that another user does not claim it) - For simplicity I am not implementing the locking strategy but it can be implemented similar to the blog - [Ensuring consistency with atomic operation in redis](https://medium.com/@sushilm2011/redis-ensuring-consistency-with-atomic-operations-part-6-526214bbc326) This way another user won’t be able to claim the treasure
3. Another point to note: Treasure manipulation should not be possible as the treasure data is secure and we are only working with treasure_id and cache here. (Treasure id will be clear from High Level Design)
4. How about bots which can go from one place to another very fast for collecting the treasures - For this we can store the last collected treasure coordinate based on user so that we can find out what was the distance of last collected treasure and current request and validate the request.

### Summary

When a collection request comes:

1. **Proximity Validation**: Validate the permissible distance between the user’s last collected treasure coordinate and the current request coordinate.
2. **Cache Validation**: Validate the treasure’s presence in the cache.
3. **Atomic Removal and Locking**: Use distributed locks to ensure atomic operations for treasure removal from the cache (Redis).
4. **Update User Inventory**: If all checks pass, update the user’s inventory with the new treasure.