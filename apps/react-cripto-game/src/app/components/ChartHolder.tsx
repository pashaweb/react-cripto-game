import { useEffect, useRef } from "react";
import LineChart, { LineChartRef, LineData } from "./LineChart";
import { CryptoNames, useCryptoHook } from "../hooks/useCriptosHook";
type ChartHolderProps = {
    name: CryptoNames;
}

export const demoData: LineData[] = [
    [0, 10],
    [5, 40],
    [20, 50],
    [35, 40],
    [50, 80],
    [65, 60],
    [80, 20],
    [95, 30],
    [100, 10],
    [105, 40],
    [120, 50],
    [200, 10],
    [205, 40],
    [265, 60],
    [280, 20],
    [300, 10],
    [350, 40],
    [480, 20],
    [495, 30]
];

const dataConverter = (data: number[]): LineData[] => {
    //const max = Math.max(...data);
    const min = Math.min(...data);

    return data.map((value, index) => {
        return [index, value - min];
    })
}
const ChartHolder = (props: ChartHolderProps) => {
    const { name } = props;
    const linearChartRef = useRef<LineChartRef | null>(null);
    const { cryptos, currentCryptoPrice } = useCryptoHook();
    const setChartData = (data: LineData[]) => {
        const el = linearChartRef.current;
        if (!el) {
            return;
        }
        el.setData(data);
    }


    useEffect(() => {
        const data = cryptos.get(name);
        if (!data) {
            return;
        }
        const lineData = dataConverter(data);
        setChartData(lineData);
    }
        , [cryptos, name]);

    return (
        <div className="chart-holder">
            <div>
                Current Price:<br />
                <strong></strong>{currentCryptoPrice.get(name)}
            </div>
            <LineChart width={200} height={70} ref={linearChartRef} />

        </div>
    )
}


export default ChartHolder;