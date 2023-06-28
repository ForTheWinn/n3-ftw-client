import React, { useEffect, useState } from "react";
import { useApp } from "../../../../../common/hooks/use-app";
import { useParams } from "react-router-dom";
import { BRIDGE_CHAINS, BRIDGE_CONTRACTS } from "../../../../../consts/bridge";
import { TESTNET } from "../../../../../consts/global";
import { Tabs } from "antd";
import BridgeHistoryIn from "../BridgeHistoryIn";
import BridgeHistoryOut from "../BridgeHistoryOut";
import HeaderBetween from "../../../../components/Commons/HeaderBetween";
import { BRIDGE_PATH } from "../../../../../consts/routes";

const BridgeHistory = (props) => {
  const { network } = useApp();
  const params = useParams();
  const { chainId } = params as any;
  const contractHash =
    BRIDGE_CONTRACTS[network][network === TESTNET ? 889 : 888][chainId];
  const evmChain = BRIDGE_CHAINS[network][chainId];
  return (
    <>
      <HeaderBetween title="Bridge history" path={BRIDGE_PATH} />
      <div className="box">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `To ${evmChain.name}`,
              key: "1",
              children: (
                <BridgeHistoryIn
                  network={network}
                  contractHash={contractHash}
                />
              )
            },
            {
              label: "To Neo",
              key: "2",
              children: (
                <BridgeHistoryOut
                  network={network}
                  contractHash={contractHash}
                />
              )
            }
          ]}
        />
      </div>
    </>
  );
};

export default BridgeHistory;
