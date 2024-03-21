import { useState, useCallback } from "react";
import { NEO_CHAIN } from "../../../../../../../consts/global";
import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { setTokenData } from "../../../../../../../packages/evm/contracts/smith";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import { CHAINS } from "../../../../../../../consts/chains";
import { INetworkType } from "../../../../../../../packages/neo/network";
import { message } from "antd";
import { extractErrorMessage } from "../../../../../../../common/helpers";
import { getSmithTokenList } from "../../../../../../../common/routers/smith";
import { ISmithTokenProps } from "../../../../../../../common/routers/smith/interfaces";
import { getPrices } from "../../../../../../../common/routers/global";
import { IPrices } from "../../../../../../../packages/neo/api/interfaces";

export const useTokenData = (
  chain: CHAINS,
  network: INetworkType,
  page: number
) => {
  const [prices, setPrices] = useState<IPrices>();
  const [data, setData] = useState<ISmithTokenProps[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      let res = await getSmithTokenList(chain, network, page);
      setData(res.items);
      setTotalPages(res.totalPages);
      setPrices(await getPrices(chain));
    } catch (e) {
      console.error(e);
      setError(true);
    }

    setLoading(false);
  }, [chain, network, page]);

  return { data, loading, error, totalPages, prices, fetchData };
};

export const useUpdateTokenMetadata = (chain, network, setTxid) => {
  const [error, setError] = useState(false);
  const { client } = useWalletRouter(chain);
  const updateTokenMetadata = useCallback(
    async (values) => {
      setError(false);
      try {
        let res: any;
        if (chain === NEO_CHAIN) {
          res = await new SmithContract(network).updateManifest(
            client,
            values.contractHash,
            JSON.stringify({
              logo: values.icon,
              website: values.website,
            })
          );
        } else {
          res = await setTokenData(
            chain,
            network,
            values.contractHash,
            values.icon,
            values.website
          );
        }
        setTxid(res);
      } catch (e) {
        console.error(e);
        message.error(extractErrorMessage(e));
      }
    },
    [chain, network, setTxid]
  );

  return { updateTokenMetadata, error };
};
