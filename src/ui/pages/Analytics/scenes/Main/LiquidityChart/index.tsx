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
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { RestAPI } from "../../../../../../packages/neo/api";
import { useApp } from "../../../../../../common/hooks/use-app";
// import Spinner from "../Spinner";

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
    line: {
      tension: 0.4
    },
    point: {
      radius: 0
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    y: {
      prefix: "$",
      grid: {
        color: "white"
      },
      ticks: {
        callback: (value) => {
          return "$" + value.toLocaleString();
        }
      }
    },
    x: {
      // display:false,
      grid: {
        color: "white"
      }
    }
  }
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      // label: undefined,
      data: [1, 2, 3, 4, 5, 6, 7],
      borderColor: "rgba(32, 226, 47, 1)",
      backgroundColor: "rgba(32, 226, 47, 0.56)"
    }
  ]
};

interface ILiquidityChartProps {
  id: string;
  days: string;
}
const LiquidityChart = ({ id, days }: ILiquidityChartProps) => {
  const { network } = useApp();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getLiquidity(id, days);
        setData(res);
        setLoading(false);
      } catch (e: any) {
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
          fill: true,
          // label: undefined,
          data: data && data.data ? data.data : [],
          borderColor: "rgba(32, 226, 47, 1)",
          backgroundColor: "rgba(32, 226, 47, 0.56)"
        }
      ]
    };
  }, [data]);

  return (
    <div className="is-relative">
      <Line options={options} data={dataset} />
    </div>
  );
};

export default LiquidityChart;
