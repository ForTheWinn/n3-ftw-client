import React, { useEffect, useState } from "react";
import PageLayout from "../../../../../components/Commons/PageLayout";
import { useWallet } from "../../../../../../packages/neo/provider";
import { RestAPI } from "../../../../../../packages/neo/api";
import DataTable from "react-data-table-component";
import PairIcons from "../../../../../components/PairIcons";
import { MAINNET } from "../../../../../../packages/neo/consts";
import { numberTrim } from "../../../../../../packages/neo/utils";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    cell: (row) => {
      return (
        <div className="is-flex is-center">
          {/*<PairIcons*/}
          {/*	network={MAINNET}*/}
          {/*	tokenA={row.token_A_id.slice(2)}*/}
          {/*	tokenB={row.token_B_id.slice(2)}*/}
          {/*/>*/}
          <span className="ml-2">{row.name}</span>
        </div>
      );
    }
  },
  {
    name: "Staked Liquidity",
    selector: (row) => (row.tvl > 0 ? "$" + numberTrim(row.tvl) : "-")
  },
  {
    name: "Claimed Rewards",
    selector: (row) => (row.rewards > 0 ? "$" + numberTrim(row.rewards) : "-")
  },
  {
    name: "APR",
    selector: (row) => `${row.APR}%`
  }
];

const FarmAnalytics = (props) => {
  const { network } = useWallet();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const res = await new RestAPI(network).getFarms();
        setData(res);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        // setError(e.message);
      }
    }
    fetch();
  }, []);
  return (
    <div>
      <section className="hero is-white is-small">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Farm Analytics</h1>
            {/*<p className="subtitle is-6">*/}
            {/*  Click on the column name to sort pairs by its TVL, volume, fees or*/}
            {/*  APY.*/}
            {/*</p>*/}
          </div>
        </div>
      </section>
      <PageLayout>
        <div className="box is-shadowless">
          <DataTable
            columns={columns}
            data={data}
            progressPending={isLoading}
          />
        </div>
      </PageLayout>
    </div>
  );
};

export default FarmAnalytics;
