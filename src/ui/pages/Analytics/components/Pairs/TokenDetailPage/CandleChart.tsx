import React, { useEffect, useRef } from "react";
import { useOnChainData } from "../../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../../packages/neo/api";
import { MAINNET, NEO_CHAIN } from "../../../../../../consts/global";
import { CHAINS } from "../../../../../../consts/chains";
import { createChart, CrosshairMode } from "lightweight-charts";
import { Divider } from "antd";
import { formatSignificantNumbers } from "../../../../../../common/helpers";

interface ICandleChartProps {
  chain: CHAINS;
  tokenHash: string;
  height?: number;
}

function showCustomTooltip(data: any) {
  console.log(data.volume);
  const { open, close, volume } = data;
  const percentageChange = ((open - close) / open) * 100;
  // function showCustomTooltip( data: any) {
  const tooltip: any = document.getElementById("percentage_tooltip");
  tooltip.innerHTML = `Change: ${percentageChange.toFixed(2)}%${
    volume ? "<br>Volume: $" + formatSignificantNumbers(volume) : ""
  }`;
  tooltip.style.display = "block";
  tooltip.style.color = close > open ? GREEN : RED; // Color based on price increase or decrease
}

const RED = "rgba(255, 82, 82, 1)";
const GREEN = "rgba(38, 166, 154, 1)";

const CandleChart = ({ chain, tokenHash, height = 300 }: ICandleChartProps) => {
  const { data, isLoaded, error } = useOnChainData(() => {
    if (chain === NEO_CHAIN) {
      return new RestAPI(MAINNET).getNEOPriceCandle(tokenHash);
    } else {
      // return new RestAPI(MAINNET).getEVMSwaps({
      //   chain,
      //   tokens: tokens.join(","),
      // });
    }
  }, [chain]);

  const chartContainerRef: any = useRef();

  useEffect(() => {
    if (chartContainerRef.current && data && isLoaded) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: {
          //@ts-ignore
          backgroundColor: "#ffffff",
          // textColor: "rgba(33, 56, 77, 1)",
        },
        grid: {
          vertLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
          horzLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        priceScale: {
          // borderColor: "rgba(197, 203, 206, 1)",
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
          borderVisible: false,
          // mode: 1, // Index for percentage mode
          autoScale: true,
          // interverScale: true,
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false, // Adjust according to your interval
        },
        // autoSize: true,
      });

      const candleSeries = chart.addCandlestickSeries({
        priceFormat: {
          type: "custom",
          formatter: (price) => price.toFixed(5),
        },
        downColor: GREEN,
        borderDownColor: GREEN,
        wickDownColor: GREEN,
        upColor: RED,
        borderUpColor: RED,
        wickUpColor: RED,
      });

      candleSeries.setData(data);

      // Assuming 'data' is sorted and contains the timestamp in Unix format
      // Set visible range to the last 24 hours based on the last data timestamp
      if (data.length > 0) {
        const lastDataTimestamp = data[data.length - 1].time; // Ensure your data array has a 'time' property
        const fromTimestamp = lastDataTimestamp - 24 * 60 * 60; // Subtract 24 hours
        chart.timeScale().setVisibleRange({
          from: fromTimestamp as any, // Convert to seconds since lightweight-charts uses seconds
          to: lastDataTimestamp,
        });
      }

      chart.subscribeCrosshairMove(function (param: any) {
        if (!param || !param.seriesData) {
          return;
        }
        const seriesPrice = param.seriesData.get(candleSeries);
        if (!seriesPrice) {
          return;
        }

        showCustomTooltip({
          ...seriesPrice,
          volume: data[param.logical].volume,
        });
      });

      return () => {
        chart.remove();
      };
    }
  }, [data]);

  if (!data) return <></>;

  return (
    <div style={{ position: "relative" }}>
      <div ref={chartContainerRef}></div>
      <div
        id="percentage_tooltip"
        style={{
          display: "none",
          position: "absolute",
          pointerEvents: "none",
          zIndex: 1,
          top: "0",
        }}
      ></div>
      <Divider />
    </div>
  );
};

export default CandleChart;
