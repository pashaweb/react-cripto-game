import { useState } from 'react';
import styles from './CurrencyTrader.module.css';
import ChartHolder from './ChartHolder';
import { CryptoNames } from '../store/store';

type CurrencyTraderProps = {
    children?: React.ReactNode;
    name: CryptoNames;
    coins: number;
    buyCrypto: (name: CryptoNames, amaunt: number) => void;
    sellCrypto: (name: CryptoNames, amaunt: number) => void;
};

export function CurrencyTrader(props: CurrencyTraderProps) {

    const { name, coins, buyCrypto, sellCrypto } = props;
    const [amount, setAmount] = useState(1000);
    const children = props.children;

    return (

        <div className={styles.card}>
            <img src={`/images/${name}.png`} alt="fsw" />
            <h2>{name}</h2>

            {children}

            <p>
                <label>Coin:</label>
                <br /> <b>{coins}</b>
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

