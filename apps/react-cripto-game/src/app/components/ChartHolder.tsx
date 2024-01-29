import { useEffect, useRef } from "react";
import LineChart, { LineChartRef, LineData } from "./LineChart";
import { CryptoNames, useCryptoStore } from "../store/store";
type ChartHolderProps = {
    name: CryptoNames;
    currentPrice: number;
    chartData: number[] | undefined;

}

const dataConverter = (data: number[]): LineData[] => {
    //const max = Math.max(...data);
    const min = Math.min(...data);

    return data.map((value, index) => {
        return [index, value - min];
    })
}
const ChartHolder = (props: ChartHolderProps) => {
    const { currentPrice, chartData } = props;
    const linearChartRef = useRef<LineChartRef | null>(null);
    //const { cryptoMap, currentPrices } = useCryptoStore();
    const setChartData = (data: LineData[]) => {
        const el = linearChartRef.current;
        if (!el) {
            return;
        }
        el.setData(data);
    }


    useEffect(() => {
        const data = chartData ? chartData : [];

        const lineData = dataConverter(data);
        setChartData(lineData);
    }
        , [chartData]);

    return (
        <div className="chart-holder">
            <div>
                Current Price:<br />
                <strong>{currentPrice}</strong>
            </div>
            <LineChart width={200} height={70} ref={linearChartRef} />

        </div>
    )
}


export default ChartHolder;