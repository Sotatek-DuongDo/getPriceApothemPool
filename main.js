const { ethers, BigNumber } = require("ethers");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
// const { abi: QuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const { getPoolImmutables } = require('./helpers')
const ABI = require('./abi/erc20.json')

// const { Pool, FeeAmount, encodeSqrtRatioX96 } = require('@uniswap/v3-sdk');


// UNI ABI
const QuoterABIXswap = require('./abi/quoter_UNI.json')

require('dotenv').config()

// const provider = new ethers.providers.JsonRpcProvider('https://goerli.blockpi.network/v1/rpc/public')
const provider = new ethers.providers.JsonRpcProvider('https://erpc.apothem.network')


// UNI
// const poolAddress = '0x6D148b26d4BA7365989702E8af2449DDDd2a77A0'
// const quoterAddress = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"


// APOTHEM
const poolAddress = '0xcae9afb72ad8fbf86a007668c919f2f03faceeaa'
const quoterAddress = "0xab83088144b228b9eaf1e085581e630715e266dc"

const getPrice = async (inputAmount) => {
    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    )

    const tokenAddress0 = await poolContract.token0();
    const tokenAddress1 = await poolContract.token1();

    const tokenAbi0 = ABI
    const tokenAbi1 = ABI

    const tokenContract0 = new ethers.Contract(
        tokenAddress0,
        tokenAbi0,
        provider
    )


    const tokenContract1 = new ethers.Contract(
        tokenAddress1,
        tokenAbi1,
        provider
    )

    const tokenSymbol0 = await tokenContract0.symbol()
    const tokenSymbol1 = await tokenContract1.symbol()
    const tokenDecimals0 = await tokenContract0.decimals()
    const tokenDecimals1 = await tokenContract1.decimals()

    console.log(`tokenSymbol0, `, tokenContract0.address, tokenSymbol0, tokenDecimals0)
    console.log(`tokenContract1`, tokenContract1.address, tokenSymbol1, tokenDecimals1)

    const quoterContract = new ethers.Contract(
        quoterAddress,
        QuoterABIXswap,
        provider
    )


    const immutables = await getPoolImmutables(poolContract)

    // console.log(`immutables`, immutables)
    const amountIn = ethers.utils.parseUnits(inputAmount.toString(), tokenDecimals0)
    console.log(
        immutables.token1,
        immutables.token0,
        amountIn,
        immutables.fee,
        0
    )


    // quoteExactOutputSingle
    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        [
            
            immutables.token1,
            immutables.token0,
            amountIn,
            immutables.fee,
            0
        ]
    )
    console.log(`quotedAmountOut`, quotedAmountOut)
    const amountOut = ethers.utils.formatUnits(quotedAmountOut[0], tokenDecimals1)

    console.log('=========')
    console.log(`${inputAmount} ${tokenSymbol0} can be swapped for ${amountOut} ${tokenSymbol1}`)
    console.log('=========')
}

getPrice(1)