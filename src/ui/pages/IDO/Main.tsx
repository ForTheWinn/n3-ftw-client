import React, { useState } from "react";
import { payments } from "../../../packages/neo/contracts/ftw/ido/consts";
import { useWallet } from "../../../packages/provider";
import { IDOContract } from "../../../packages/neo/contracts/ftw/ido";
import Tokenomics from "./components/Tokenomics";
import PaymentSelection from "./components/PaymentSelection";
import Modal from "../../components/Modal";
import IDOInfo from "./components/IDOInfo";
import AfterTransactionSubmitted from "../../components/NeoComponents/AfterTransactionSubmitted";
import toast from "react-hot-toast";
import { handleError } from "../../../packages/neo/utils/errors";

const Main = () => {
  const { network, connectedWallet } = useWallet();
  const defaultToken = payments(network)[0];
  const [token, setToken] = useState<
    | {
        contractHash: string;
        symbol: string;
        logo: string;
        decimals: number;
        amount: number;
      }
    | undefined
  >({ ...defaultToken });
  const [amount, setAmount] = useState<number | undefined>();
  const [txid, setTxid] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [isTokenSelectionModalActive, setTokenSelectionModalActive] =
    useState(false);

  const onTokenClick = (token) => {
    setToken(token);
    setTokenSelectionModalActive(false);
  };

  const handleExchange = async () => {
    if (connectedWallet && amount && token) {
      try {
        const res = await new IDOContract(network).buy(
          connectedWallet,
          token.contractHash,
          token.decimals,
          amount
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    }
  };

  const onSuccess = () => {
    setRefresh(refresh + 1);
    setTxid("");
  };

  // const { isLoaded, data } = useOnChainData(() => {
  //   return new IDOContract(network).getIDOStatus(connectedWallet);
  // }, [network, connectedWallet, refresh]);
  //
  // if (!isLoaded) return <div></div>;
  //
  // const totalSales = parseFloat(
  //   u.BigInteger.fromNumber(data.totalSales).toDecimal(8)
  // );
  // const totalSalesInPercentage = (totalSales / TOTAL_TOKENS_FOR_SALE) * 100;
  // const availableNEP = parseFloat(
  //   u.BigInteger.fromNumber(data.availableBalance).toDecimal(8)
  // );
  // const userBalanceForSwap =
  //   token &&
  //   data.balances[token.contractHash] &&
  //   data.balances[token.contractHash] !== 0
  //     ? parseFloat(
  //         u.BigInteger.fromNumber(data.balances[token.contractHash]).toDecimal(
  //           token.decimals
  //         )
  //       )
  //     : 0;
  // console.log("Available balance " + availableNEP);

  return (
    <>
      <IDOInfo
      // launchAt={data.launchAt}
      // totalSales={(TOTAL_TOKENS_FOR_SALE - availableNEP).toLocaleString()}
      // totalSalesInPercentage={parseFloat(totalSalesInPercentage.toString())}
      />

      {/*{token ? (*/}
      {/*  <div className="box">*/}
      {/*    <div className="block">*/}
      {/*      <Input*/}
      {/*        isDisable={false}*/}
      {/*        heading="Send"*/}
      {/*        onClickAsset={() => {*/}
      {/*          setTokenSelectionModalActive(true);*/}
      {/*        }}*/}
      {/*        contractHash={token.contractHash}*/}
      {/*        symbol={token.symbol}*/}
      {/*        decimals={token.decimals}*/}
      {/*        val={amount}*/}
      {/*        setValue={(value) => {*/}
      {/*          setAmount(value);*/}
      {/*        }}*/}
      {/*        logo={token.logo}*/}
      {/*        userBalance={userBalanceForSwap}*/}
      {/*      />*/}
      {/*      <div className="pt-4 pb-4 has-text-centered">*/}
      {/*        <FaArrowDown size={16} />*/}
      {/*      </div>*/}
      {/*      <Input*/}
      {/*        isReadOnly={true}*/}
      {/*        heading="Receive"*/}
      {/*        onClickAsset={() => {*/}
      {/*          // setTokenSelectionModalActive(true);*/}
      {/*        }}*/}
      {/*        contractHash={NEP_SCRIPT_HASH}*/}
      {/*        symbol={"NEP"}*/}
      {/*        logo={"/symbols/nep.png"}*/}
      {/*        decimals={8}*/}
      {/*        val={amount ? amount * token.amount : undefined}*/}
      {/*        setValue={() => {}}*/}
      {/*        userBalance={undefined}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="block">*/}
      {/*      <button*/}
      {/*        onClick={() => {*/}
      {/*          if (moment().valueOf() >= data.launchAt) {*/}
      {/*            if (connectedWallet) {*/}
      {/*              handleExchange();*/}
      {/*            } else {*/}
      {/*              toggleWalletSidebar();*/}
      {/*            }*/}
      {/*          } else {*/}
      {/*            toast.error("Launched yet");*/}
      {/*          }*/}
      {/*        }}*/}
      {/*        disabled={amount === undefined || amount > userBalanceForSwap}*/}
      {/*        className="button is-fullwidth is-primary"*/}
      {/*      >*/}
      {/*        {totalSales !== TOTAL_TOKENS_FOR_SALE ? "Swap" : "Finished"}*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*) : (*/}
      {/*  <></>*/}
      {/*)}*/}

      {/*<div className="box">*/}
      {/*  <PaymentSelection*/}
      {/*    network={network}*/}
      {/*    onClick={(token) => {*/}
      {/*      setToken(token);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}

      <Tokenomics />

      {isTokenSelectionModalActive && (
        <Modal onClose={() => setTokenSelectionModalActive(false)}>
          <>
            <PaymentSelection
              currentTokenHash={token ? token.contractHash : undefined}
              network={network}
              onClick={onTokenClick}
            />
          </>
        </Modal>
      )}

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            txid={txid}
            network={network}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </>
  );
};

export default Main;
