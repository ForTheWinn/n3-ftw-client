import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { numberTrim } from "../../../../../packages/neo/utils";
import { useApp } from "../../../../../common/hooks/use-app";
import { useOnChainData } from "../../../../../common/hooks/use-onchain-data";
import { RestAPI } from "../../../../../packages/neo/api";
import { Card } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    y: {
      grid: {
        color: "white",
      },
      ticks: {
        callback: (value) => {
          return "$" + numberTrim(value, 4);
        },
      },
    },
    x: {
      grid: {
        color: "white",
      },
    },
  },
};

interface ITokenPriceChartProps {
  tokenId: string;
  days: string;
}
const TokenPriceChart = ({ tokenId, days }: ITokenPriceChartProps) => {
  const { network } = useApp();
  const { data, isLoaded } = useOnChainData(() => {
    return new RestAPI(network).getNumbersWithRange(tokenId, days);
  }, [network]);

  const dataset = useMemo(() => {
    return {
      labels: data && data.labels ? data.labels : [],
      datasets: [
        {
          label: "Price",
          data: data && data.prices ? data.prices : [],
          borderColor: "#b23bff",
          backgroundColor: "#b23bff",
        },
      ],
    };
  }, [data]);
  const price = data && data.prices ? data.prices[data.prices.length - 1] : 0;
  return (
    <Card style={{ height: "240px" }} loading={!isLoaded}>
      <Card.Meta title={"NEP now: $" + price.toFixed(6)} />
      <br />
      <Line options={options} data={dataset} />
    </Card>
  );
};

export default TokenPriceChart;
