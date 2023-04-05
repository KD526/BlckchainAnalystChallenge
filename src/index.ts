import { HelpersWrapper } from "./utils/helpers"

const main = async () => {

    console.log("*******STARTING THE BOT********")

    //Example usage
    const currentRatio = 0.15;
    const newRatio = 0.5;
    const totalEthStaked = 100;

    // const [currentApr, newApr] = await HelpersWrapper.calculateApr(currentRatio, newRatio, totalEthStaked)

    // console.log(`Current APR: ${currentApr.toFixed(2)}%`);
    // console.log(`New APR: ${newApr.toFixed(2)}%`);

    await HelpersWrapper.solanaImplementation()

}

main()