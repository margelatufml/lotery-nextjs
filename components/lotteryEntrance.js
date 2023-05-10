import { useWeb3Contract } from "react-moralis"
import { abi, contractAdresses } from "../constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function lotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAdresses ? contractAdresses[chainId][0] : null // const { runContractFunction: enterRaffle } = useWeb3Contract({
    const [entranceFee, setEntranceFee] = useState("0")
    const [NumPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setrecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                const numplayersFromCall = (await getNumberOfPlayers()).toString()
                const recentWinnerFromCall = (await getRecentWinner()).toString()
                setEntranceFee(entranceFeeFromCall)
                setNumPlayers(numplayersFromCall)
                setrecentWinner(recentWinnerFromCall)

                console.log(entranceFee)
            }
            const x = updateUI()
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSucces = async function (tx) {
        try {
            await tx.wait(1)
            handleNewNotification(tx)
            await updateUI()
        } catch (error) {
            console.log(error)
        }
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topL",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from the lottery
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSucces,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div> EntranceFee:{ethers.utils.formatUnits(entranceFee, "ether")} ETH!</div>
                    <div> NumberOfPlayers:{NumPlayers}</div>
                    <div> RecentWinner:{recentWinner}</div>
                </div>
            ) : (
                <div>No raffle adressValid</div>
            )}
        </div>
    )
}
