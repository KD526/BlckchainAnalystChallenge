# Install dependencies

- to install dependencies run the commmand: npm i

# To run the project

- to run the project run the command: npm run start

# ADDITIONAL INFORMATION

- Inside the src/utils folder we have a Helper Class that has all the functionality that was required to be implemented on the challenge. So all the functions that are on this class are well commented out on what they execute as per the challenge questions. Thes functions are exported through the HelpersWrapper to be used on the index.ts file when running the project.

NB To run the different functions on the HelpersWrapper you can just call them on the index.ts file like below
For Question 1 [a] Using the Solana docs, write the following scripts in your preferred language
i)Query the latest block
ii) Get a list of all Validators (or subset, but logic in code to get all)
iii) A list of delegators for the largest validator (or subset, but logic in code to get all)

So , the function to be called on the index.ts file from the HelpersWrapper when running the script will be:

await HelpersWrapper.solanaImplementation()

-NOTE: Do the same for every function that you need to execute as per the challenge questions!

# CALCULATION OF APR

The estimated APR for staking ETH will depend on various factors such as the current ETH price, the total amount of ETH staked, the current staking ratio, and the total rewards distributed. According to the Ethereum.org docs and BitMex blog, the expected APR for staking ETH varies based on the staking ratio.

Assuming a constant ETH price and reward distribution rate, we can estimate the APR for staking ETH based on the change in staking ratio from 15% to 50%. The expected APR can be calculated using the following formula:

Expected APR = (Total rewards / Total staked ETH) \* 100

To calculate the total rewards, we need to know the annual issuance rate of ETH, which is currently around 4%. Assuming that all stakers receive a proportional share of the rewards, we can calculate the total rewards distributed based on the total staked ETH.

Using this information, we can estimate the APR as follows:

At a 15% staking ratio:
Total rewards = (15% _ Annual issuance rate _ Total ETH staked) = 0.6% _ Total ETH staked
Expected APR = (0.6% _ Total ETH staked) / Total ETH staked \* 100 = 0.6%

At a 50% staking ratio:
Total rewards = (50% _ Annual issuance rate _ Total ETH staked) = 2% _ Total ETH staked
Expected APR = (2% _ Total ETH staked) / Total ETH staked \* 100 = 2%

Therefore, the estimated APR for staking ETH would increase from 0.6% to 2% if the staking ratio of ETH goes from 15% to 50%.
