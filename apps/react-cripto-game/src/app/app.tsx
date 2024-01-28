// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { useCryptoHook, type CryptoNames } from './hooks/useCriptosHook';
import { CurrencyTrader } from './components/CurrencyTrader';
import ChartHolder from './components/ChartHolder';


export function App() {

  const {
    moneyData,
    byCurrency,
    sellCurrency,
  } = useCryptoHook();


  const handeleBuyCrypto = (crypto: CryptoNames, amaunt: number) => {
    byCurrency(crypto, amaunt);
  }

  const handleSellCrypto = (crypto: CryptoNames, amaunt: number) => {
    sellCurrency(crypto, amaunt);
  }



  return (

    <main className={styles.app}>
      <h1>Welcome to react-cripto-game!</h1>


      {/* {
        [...cryptos.keys()].map((key) => {
          return (
            <div key={key}>
              <h2>{key}</h2>
              <p>{cryptos.get(key)?.join(', ')}</p>
            </div>
          ) display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
  border: #5472b1 1px solid;
  padding: 0.5rem;
  margin: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  button {
    background-color: #384a72;
    color: #fff;
    border: none;
    border-radius: 50%;
    padding: 1rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #5472b1;
    }
  }
        })
      } */}

      <div className={styles['my-money']} >
        <img src='/images/usd.png' alt="fsw" />

        <h2>
          My money <br></br>{moneyData.usd} $
        </h2>


      </div>
      <div className={styles['fake-masonry']}>
        {
          [...Object.entries(moneyData.coins)].map((coin, i) => {
            return (


              <CurrencyTrader
                key={`coin${i}`}
                name={coin[0] as CryptoNames}
                coins={coin[1]}
                buyCrypto={handeleBuyCrypto}
                sellCrypto={handleSellCrypto}
              />

            )
          })
        }
      </div>
    </main>

  );
}

export default App;
