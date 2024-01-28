
import { create } from 'zustand'
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


type States = {
    cryptoMap: Map<CryptoNames, number[]>,
    currentPrices: Map<CryptoNames, number>,
    moneyData: MoneyData,
}

type Actions = {
    buy: (coin: CryptoNames, amount: number) => void,
    sell: (coin: CryptoNames, amount: number) => void,
    setFee: (fee: number) => void,
    setCurrentPrices: (map: Map<CryptoNames, number>) => void,
    setCryptoMap: (data: Crypto[]) => void,
}

type Store = States & Actions;

const createCriptoMap = (state: Map<CryptoNames, number[]>, data: Crypto[]) => {
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

const setLocalData = (data: MoneyData) => {
    localStorage.setItem('crypto-game', JSON.stringify(data));
}

const getLocalData = (): MoneyData | null => {
    const localData = localStorage.getItem('crypto-game');
    if (localData) {
        const data = JSON.parse(localData);
        return data;
    }
    return null;
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

export function initStore() {
    const localData = getLocalData();
    if (localData) {
        useCryptoStore.setState({ moneyData: localData });
    }

    setInterval(async () => {
        const response = await fetch(
            "https://api.coincap.io/v2/assets?limit=10"
        );
        const data = await response.json();
        useCryptoStore.getState().setCryptoMap(data.data);
        const newCurrentPrices = setCurrentPrices(
            useCryptoStore
                .getState()
                .currentPrices,
            data.data as Crypto[]
        );
        useCryptoStore.getState().setCurrentPrices(
            newCurrentPrices
        );

    }, 1000)
}





export const useCryptoStore = create<Store>((set, get) => ({
    cryptoMap: criptoMapInit,
    currentPrices: currentPricesInit,
    moneyData: moneyDataInit,
    buy: (coin: CryptoNames, amount: number) => {
        const currentPrice = get().currentPrices.get(coin)!;
        const totalValInUsd = get().moneyData.usd;
        const totalValInCrypto = get().moneyData.coins[coin];
        const fee = get().moneyData.fee;

        const { totalValInUsd: totalValInUsdAfterTransfer, totalValInCrypto: totalValInCryptoAfterTransfer } = byCrypto(
            totalValInUsd,
            totalValInCrypto,
            amount,
            currentPrice,
            fee
        );

        const coins = { ...get().moneyData.coins };
        coins[coin] = totalValInCryptoAfterTransfer;

        const newMoneyData = {
            ...get().moneyData,
            usd: totalValInUsdAfterTransfer,
            coins
        }
        set({ moneyData: newMoneyData });
        setLocalData(newMoneyData);
    },
    sell: (coin: CryptoNames, amount: number) => {
        const currentPrice = get().currentPrices.get(coin)!;
        const totalValInUsd = get().moneyData.usd;
        const totalValInCrypto = get().moneyData.coins[coin];
        const fee = get().moneyData.fee;

        const { totalValInUsd: totalValInUsdAfterTransfer, totalValInCrypto: totalValInCryptoAfterTransfer } = byUsd(
            totalValInUsd,
            totalValInCrypto,
            amount,
            currentPrice,
            fee
        );

        const coins = { ...get().moneyData.coins };
        coins[coin] = totalValInCryptoAfterTransfer;

        const newMoneyData = {
            ...get().moneyData,
            usd: totalValInUsdAfterTransfer,
            coins
        }
        set({ moneyData: newMoneyData });
        setLocalData(newMoneyData);
    },
    setFee: (fee: number) => {
        const newMoneyData = {
            ...get().moneyData,
            fee
        }
        set({ moneyData: newMoneyData });
        setLocalData(newMoneyData);
    },
    setCurrentPrices: (map: Map<CryptoNames, number>) => {
        set({ currentPrices: map });

    },
    setCryptoMap: (data: Crypto[]) => {
        const cryptoMap = createCriptoMap(get().cryptoMap, data);
        set({ cryptoMap });

    },

}));



// const useFishStore = create(
//     persist(
//         (set, get) => ({
//             fishes: 0,
//             addAFish: () => set({ fishes: get().fishes + 1 }),
//         }),
//         {
//             name: 'food-storage', // name of the item in the storage (must be unique)
//             storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
//         },
//     ),
// )