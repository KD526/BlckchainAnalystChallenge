import { ethers, providers } from 'ethers'
import { PANCAKESWAP_ABI } from '../ABI/abi'
import { Config } from '../config/config'
import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import axios from 'axios'
import { Connection, PublicKey } from "@solana/web3.js";

class Helpers {
    public _provider: providers.Provider
    public _signer: ethers.Wallet
    public _wssUrl: providers.WebSocketProvider

    constructor() {
        this._provider = new ethers.providers.JsonRpcProvider(
            Config.JSON_RPC_PROVIDER,
        )
        this._signer = new ethers.Wallet(Config.PRIVATE_KEY, this._provider)
        this._wssUrl = new ethers.providers.WebSocketProvider(Config.WSS_URL)
    }


    /**
     * This function is used to get the contract instance
     * @returns contract instance
     */

    async getContractInstance() {
        return new ethers.Contract(
            Config.PANCAKESWAP_ROUTER,
            PANCAKESWAP_ABI,
            this._provider,
        )
    }


    /**
     * This function is used to get the deposit events from the staking contract
     * @returns deposit events
     */
    async getDepositEvents() {
        await Moralis.start({
            apiKey: Config.MORALIS_API_KEY,
        })

        const chain = EvmChain.BSC
        const address = Config.PANCAKESWAP_ROUTER

        const abi = {
            anonymous: false,
            inputs: [
                { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                { indexed: true, internalType: 'uint256', name: 'pid', type: 'uint256' },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'Deposit',
            type: 'event',
        }

        const topic = "0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15"

        const response = await Moralis.EvmApi.events.getContractEvents({
            address,
            chain,
            abi,
            topic,
        })

        const { result } = response.toJSON()

        //for loop to get the data

        const _dat = []
        for (let i = 0; i < result!.length; i++) {
            const { transaction_hash, block_number, block_hash, address, block_timestamp, data } = result![i]
            _dat.push({ transaction_hash, block_number, block_hash, address, block_timestamp, data })
        }

        console.log(_dat)

        return _dat
    }



    /**
     * This function is used to get the contract creator txHash for the staking contract
     * @returns contract creator txHash
     */
    async stakingContractDeployment() {
        try {

            const apiKey = Config.BSC_SCAN_API_KEY
            const contractAddress = Config.PANCAKESWAP_ROUTER
            const _url = `https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${apiKey}`

            const data = await axios.get(_url)

            const { result } = data.data

            console.log({ result })

            return data.data.result

        } catch (error) {
            console.log("Unable to get creator txHash", error)
        }

    }


    /**
     * This function is used to get the contract ABI
     * @returns contract ABI
     */
    async getContractABI() {
        try {
            const contractAddress = "0x73feaa1eE314F8c655E354234017bE2193C9E24E"

            const _url = `https://api.bscscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${Config.BSC_SCAN_API_KEY}`

            const data = await axios.get(_url)
            const { result } = data.data
            console.log({ result })
            return data.data.result

        } catch (error) {
            console.log("Error getting contract ABI", error)
        }
    }


    /**
     * This function is used to get the total staked cake token
     * @returns total staked cake token
     */
    async getTotalStakedCakeToken() {
        try {

            // This endpoint is throttled to 2 calls / second regardless of API Pro tier.

            const blockNumber = 27026569
            const _url = `https://api.bscscan.com/api?module=stats&action=tokensupplyhistory&contractaddress=${Config.PANCAKESWAP_ROUTER}&blockno=${blockNumber}&apikey=${Config.BSC_SCAN_API_KEY}`

            const data = await axios.get(_url)
            const { result } = data.data
            console.log({ result })
            return data.data.result

        } catch (error) {
            console.log("Error getting total staked cake token", error)
        }
    }

    /**
     * This function is used to get the latest block, validators and delegators for the largest validator
     * @returns latest block, validators, delegations
     */

    async solanaImplementation() {
        try {

            // Initialize connection to Solana cluster using Quicknode endpoint and API key
            const connection = new Connection(Config.JSON_RPC_PROVIDER, "processed");

            // Query the latest block
            const latestBlock = await connection.getLatestBlockhash();
            console.log("Latest block:", latestBlock);


            // Get a list of all validators
            const validators: any = await connection.getClusterNodes();
            console.log("Validators:", validators);


            // Get a list of delegators for the largest validator
            let largestValidator = validators[0];

            for (let i = 1; i < validators.length; i++) {
                if (validators[i].featureSet > largestValidator.featureSet) {
                    largestValidator = validators[i];

                }
            }

            const largestValidatorPublicKey: any = new PublicKey(largestValidator.pubkey);
            const delegations = await connection.getVoteAccounts(largestValidatorPublicKey);
            console.log("Delegators for largest validator:", delegations);

            return { latestBlock, validators, delegations }

        } catch (error) {
            console.log("Error getting latest block", error)
        }
    }

    /**
     * This function calculates the current APR and the new APR
     * @param totalStakedEth 
     * @param currentStakingRatio 
     * @param newStakingRatio 
     * @returns 
     */
    async calculateApr(totalStakedEth: number, currentStakingRatio: number, newStakingRatio: number): Promise<[number, number]> {
        const annualIssuanceRate = 0.04;
        const currentTotalRewards = currentStakingRatio * annualIssuanceRate * totalStakedEth;
        const newTotalRewards = newStakingRatio * annualIssuanceRate * totalStakedEth;
        const currentApr = (currentTotalRewards / totalStakedEth) * 100;
        const newApr = (newTotalRewards / totalStakedEth) * 100;
        return [currentApr, newApr];
    }

}


export const HelpersWrapper = new Helpers()
