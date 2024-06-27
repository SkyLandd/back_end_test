# Treasure Module

The responsibility of this module is to maintain the treasure settings and configurations and validate weekly and daily limits.

There are no endpoints for this module.

2 Core Settings:
1. Treasure Settings are maintained as key value pair in Db. Currently only WEEKLY and DAILY Limits are configured for verification of the user's treasure collection count
2. Pre Configured Treasures are maintained in `treasure` table, these are only distributed on the map per session. I have added some dummy data but it can be increased/maintained automatically using some generative algorithms