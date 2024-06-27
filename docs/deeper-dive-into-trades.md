# Deeper Dive into Trades

Trade by nature, happens between two players a recepient and a initiator. 
Envisioned flow is:
1. Initiator selects one of the treasure of recepient for trade against one of initiator's own treasure.
2. Initiator then initiates the trade.
3. Recepient can accept or reject a trade.
4. If accepted and at the time of trade, everything is well and good the trade completes.
5. When a trade is completed - One treasure is swapped between the participants.

Trade can have following states:
Initiated -> <>--> Accepted ---><>---> Completed
             |                  |
              ---> Rejected      ----> Failed