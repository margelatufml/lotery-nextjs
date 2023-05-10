import Head from "next/head"
import styles from "@/styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import Header from "@/components/Header"
import LotteryEntrance from "@/components/lotteryEntrance"

export default function Home() {
    return (
        <div>
            <Head>
                <title>Eco lotery</title>
                <meta name="description" content="Lottery for ECO" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <LotteryEntrance />
        </div>
    )
}
