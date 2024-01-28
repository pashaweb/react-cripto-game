import * as d3 from 'd3';
import styles from './LineChart.module.css';
import { forwardRef, useImperativeHandle, useRef } from 'react';

/* eslint-disable-next-line */
export type LineChartProps = {
  width: number;
  height: number;
  color?: string;
}
export type LineData = [number, number];

const dataUpdate = (data: LineData[], width: number, height: number, pathElement: SVGPathElement) => {
  const pData = linePath(data, width, height);

  if (pathElement) {
    d3.select(pathElement)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("d", pData);
  };
}

export type LineChartRef = {
  setData: (data: LineData[]) => void;
}

export type LineChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function getMargin(marging: number): LineChartMargin {
  return {
    top: marging,
    right: marging,
    bottom: marging,
    left: marging
  }
}

function linePath(data: LineData[], width: number, height: number) {
  const marging = getMargin(15);

  let xMax = d3.max(data, d => d[0]);
  xMax = xMax ? xMax : 100;
  let yMax = d3.max(data, d => d[1]);
  yMax = yMax ? yMax : 100;

  const xScale = d3.scaleLinear()
    .domain([0, xMax])
    .range([marging.left, width - marging.right]);
  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([height - marging.bottom, marging.top]);
  const line = d3.line<LineData>()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));
  const pathData = line(data);
  return pathData ? pathData : "";
}




export const LineChart = forwardRef<LineChartRef, LineChartProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    setData: (data: LineData[]) => {
      const el = pathElement.current;
      if (!data || el === null) {
        return;
      }

      //let fakeData: LineData[] = geNullData(oldData.current.length > 0 ? oldData.current : data);
      oldData.current = data;

      dataUpdate(data, width, height, el);
      //setAxis(data);
      // dataUpdate(fakeData, width, height, el);
      // setTimeout(() => {
      //   fakeData = geNullData(data);
      //   dataUpdate(fakeData, width, height, el);
      // }, 500);
      // setTimeout(() => {
      //   dataUpdate(data, width, height, el);
      //   setAxis(data)
      // }, 1000);
    }

  }));

  // function geNullData(data: LineData[]) {
  //   const fakeData: LineData[] = []
  //   for (let i = 0; i < data.length; i++) {
  //     fakeData.push([data[i][0], 0]);
  //   }
  //   return fakeData;
  // }


  const setAxis = (data: LineData[]) => {
    if (!xAxisRef.current || !yAxisRef.current) {

      return;
    }
    const marging = getMargin(30);
    const gx = xAxisRef.current;
    gx.setAttribute("transform", `translate(0, ${height - marging.bottom})`);
    const gy = yAxisRef.current;
    gy.setAttribute("transform", `translate(${marging.left}, 0)`);
    const xMax = d3.max(data, d => d[0]);
    const yMax = d3.max(data, d => d[1]);
    const xScale = d3.scaleLinear()
      .domain([0, xMax ? xMax : 100])
      .range([marging.left, width - marging.right]);

    const yScale = d3.scaleLinear()
      .domain([0, yMax ? yMax : 100])
      .range([height - marging.bottom, marging.top]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    d3.select(gx)
      .transition()
      .duration(750)
      .call(xAxis);
    d3.select(gy)
      .transition()
      .duration(750)
      .call(yAxis);
  }
  const { width, height } = props;
  //const [pathData, setPathData] = useState<string>("");
  const pathElement = useRef<SVGPathElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const xAxisRef = useRef<SVGGElement | null>(null);
  const oldData = useRef<LineData[]>([]);

  return (
    <div className={styles['container']}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`} className={styles['svg-box']}>
        <g ref={yAxisRef} className={styles['y-axis']} />
        <g ref={xAxisRef} className={styles['x-axis']} />
        <path
          stroke="#26a69a"
          strokeWidth='2'
          fill="none"
          ref={pathElement} />
      </svg>

    </div>
  );
})
export default LineChart;

