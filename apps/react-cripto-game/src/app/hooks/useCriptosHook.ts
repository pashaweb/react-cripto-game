import { useCallback, useEffect, useState } from "react";
import { byCrypto, byUsd } from "../utils";

export type Crypto = {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explorer: string;
}

export type CryptoNames =
    | 'bitcoin'
    | 'ethereum'
    | 'dogecoin';


const cryptoNames: CryptoNames[] = [
    'bitcoin',
    'ethereum',
    'dogecoin',
];

const criptoMapInit = new Map<CryptoNames, number[]>();



const currentPricesInit = new Map<CryptoNames, number>();

for (const name of cryptoNames) {
    criptoMapInit.set(name, []);
    currentPricesInit.set(name, 0);
}





const setCriptoMap = (state: Map<CryptoNames, number[]>, data: Crypto[]) => {
    const coins = state.keys();
    const newMap = new Map<CryptoNames, number[]>();
    for (const coin of coins) {
        const coinData = data.find((d) => d.id === coin);
        if (coinData) {
            let oldVals = state.get(coin)!;
            if (oldVals.length === 60) {
                oldVals = oldVals.slice(1);
            }

            const newValues = [...oldVals, Number(coinData.priceUsd)];
            newMap.set(coin, newValues);
        }
    }
    return newMap;
}

const setCurrentPrices = (state: Map<CryptoNames, number>, data: Crypto[]) => {
    const coins = state.keys();
    const newMap = new Map<CryptoNames, number>();
    for (const coin of coins) {
        const coinData = data.find((d) => d.id === coin);
        if (coinData) {
            newMap.set(coin, Number(coinData.priceUsd));
        }
    }
    return newMap;
}


const getLocalData = (): MoneyData | null => {
    const localData = localStorage.getItem('crypto-game');
    if (localData) {
        const data = JSON.parse(localData);
        return data;
    }
    return null;
}

const setLocalData = (data: MoneyData) => {
    localStorage.setItem('crypto-game', JSON.stringify(data));
}


type MoneyData = {
    usd: number,
    coins: {
        bitcoin: number,
        ethereum: number,
        dogecoin: number,

    },
    fee: number
}

const moneyDataInit: MoneyData = {
    usd: 100000,
    coins: {
        bitcoin: 0,
        ethereum: 0,
        dogecoin: 0,
    },

    fee: 0.01
}

export const useCryptoHook = () => {


    const [cryptos, setCryptos] = useState(criptoMapInit);
    const [currentCryptoPrice, setCurrentCryptoPrice] = useState(currentPricesInit);
    const [moneyData, setMoneyData] = useState<MoneyData>(moneyDataInit);
    const byCurrency = (currency: CryptoNames, amount: number,) => {
        const currentPrice = currentCryptoPrice.get(currency)!;
        const totalValInUsd = moneyData.usd;
        const totalValInCrypto = moneyData.coins[currency];
        const fee = moneyData.fee;

        const { totalValInUsd: totalValInUsdAfterTransfer, totalValInCrypto: totalValInCryptoAfterTransfer } = byCrypto(
            totalValInUsd,
            totalValInCrypto,
            amount,
            currentPrice,
            fee
        );

        const coins = { ...moneyData.coins };
        coins[currency] = totalValInCryptoAfterTransfer;

        const newMoneyData = {
            ...moneyData,
            usd: totalValInUsdAfterTransfer,
            coins
        }
        setMoneyData(newMoneyData);
        setLocalData(newMoneyData);

    }

    const sellCurrency = (currency: CryptoNames, amount: number,) => {
        const currentPrice = currentCryptoPrice.get(currency)!;
        const totalValInUsd = moneyData.usd;
        const totalValInCrypto = moneyData.coins[currency];
        const fee = moneyData.fee;

        const { totalValInUsd: totalValInUsdAfterTransfer, totalValInCrypto: totalValInCryptoAfterTransfer } = byUsd(
            totalValInUsd,
            totalValInCrypto,
            amount,
            currentPrice,
            fee
        );
        const coins = { ...moneyData.coins };
        coins[currency] = totalValInCryptoAfterTransfer;
        const newMoneyData = {
            ...moneyData,
            usd: totalValInUsdAfterTransfer,
            coins
        }
        setMoneyData(newMoneyData);
        setLocalData(newMoneyData);
    }


    const getCryptos = useCallback(
        async () => {
            try {
                const response = await fetch(
                    "https://api.coincap.io/v2/assets?limit=10"
                );
                const data = await response.json();
                const newCryptos = setCriptoMap(cryptos, data.data as Crypto[]);
                setCryptos(newCryptos);
                const newCurrentPrices = setCurrentPrices(currentCryptoPrice, data.data as Crypto[]);
                setCurrentCryptoPrice(newCurrentPrices);
            }
            catch (error) {
                console.log(error);
            }


        }, [cryptos, currentCryptoPrice]
    )






    useEffect(() => {
        const interval = setInterval(() => {
            getCryptos();
        }, 1000);
        const localData = () => {
            const data = getLocalData();
            if (data) {
                setMoneyData(data);
            }
        }
        localData();

        return () => clearInterval(interval);
    }, [getCryptos]);

    return {
        cryptos,
        currentCryptoPrice,
        moneyData,
        byCurrency,
        sellCurrency,
    };
}