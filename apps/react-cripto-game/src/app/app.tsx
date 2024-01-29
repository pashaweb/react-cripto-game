// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import ChartHolder from './components/ChartHolder';
import { CurrencyTrader } from './components/CurrencyTrader';
import { useCryptoStore, initStore, CryptoNames } from './store/store';
import { useEffect } from 'react';

export function App() {

  const {
    moneyData,
    currentPrices,
    cryptoMap,
    buy,
    sell,
  } = useCryptoStore();


  const handeleBuyCrypto = (crypto: CryptoNames, amaunt: number) => {
    buy(crypto, amaunt);
  }

  const handleSellCrypto = (crypto: CryptoNames, amaunt: number) => {
    sell(crypto, amaunt);
  }
  let isStarted = false;

  useEffect(() => {
    if (!isStarted) {
      initStore();
      isStarted = true;
    }
  }, []);



  return (

    <main className={styles.app}>
      <h1>Welcome to react-cripto-game!</h1>

      <div className={styles['my-money']} >
        <img src='/images/usd.png' alt="fsw" />

        <h2>
          My money <br></br>{moneyData.usd} $
        </h2>


      </div>
      <div className={styles['fake-masonry']}>
        {
          [...Object.entries(moneyData.coins)].map((coin, i) => {
            const name = coin[0] as CryptoNames;
            const props = {
              name,
              currentPrice: currentPrices.get(name) ? currentPrices.get(name) : 0,
              chartData: cryptoMap.get(name) ? cryptoMap.get(name) : [],
            }
            return (





              <CurrencyTrader
                key={`coin${i}`}
                name={coin[0] as CryptoNames}
                coins={coin[1]}
                buyCrypto={handeleBuyCrypto}
                sellCrypto={handleSellCrypto}
              >
                <ChartHolder
                  name={props.name}
                  chartData={props.chartData}
                  currentPrice={props.currentPrice || 0} />

                <div>
                  <label>Dolar Value:</label>
                  <br /> <b>
                    $ {(props.currentPrice || 0) * coin[1]}
                  </b>
                </div>


              </CurrencyTrader>



            )
          })
        }
      </div>
    </main>

  );
}

export default App;
