import { useState } from 'react';
import styles from './CurrencyTrader.module.css';
import { CryptoNames } from '../hooks/useCriptosHook';
import ChartHolder from './ChartHolder';

type CurrencyTraderProps = {
    name: CryptoNames;
    coins: number;
    buyCrypto: (name: CryptoNames, amaunt: number) => void;
    sellCrypto: (name: CryptoNames, amaunt: number) => void;
};

export function CurrencyTrader(props: CurrencyTraderProps) {

    const { name, coins, buyCrypto, sellCrypto } = props;
    const [amount, setAmount] = useState(1000);


    return (

        <div className={styles.card}>
            <img src={`/images/${name}.png`} alt="fsw" />
            <h2>{name}</h2>
            <ChartHolder name={name} />

            <p>
                <strong>
                    Coins: <br /> {coins}
                </strong>
            </p>
            <div className={styles['ammount-container']}>
                <button onClick={() => setAmount(amount + 10)}>+10</button>
                <div>${amount}</div>
                <button onClick={() => setAmount(amount - 10)}>-10</button>
            </div>
            <button
                className={styles['buy-button']}
                onClick={() => buyCrypto(name, amount)}>
                Buy {amount}$
            </button>
            <button
                className={styles['sell-button']}
                onClick={() => sellCrypto(name, amount)}>
                Sell {amount}$
            </button>

        </div>

    );

}
