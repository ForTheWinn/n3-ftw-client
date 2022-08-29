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
import { useWallet } from "../../../../../packages/provider";
import { RestAPI } from "../../../../../packages/neo/api";
import { numberTrim } from "../../../../../packages/neo/utils";

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
  const { network } = useWallet();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getNumbersWithRange(
          tokenId,
          days
        );
        const lastPrice = await new RestAPI(network).getPrice(
          tokenId
        );
				// res.
				// console.log(lastPrice)
        setData(res);
        setLoading(false);
      } catch (e: any) {
				console.log(e)
        setLoading(false);
        // setError(e.message);
      }
    }
    fetch();
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
  return (
    <div>
      <Line options={options} data={dataset} />
    </div>
  );
};

export default TokenPriceChart;
