import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../../packages/neo/provider";
import { toast } from "react-hot-toast";
import NumberFormat from "react-number-format";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import { detectEmojiInString } from "../../helpers";
import AfterTransactionSubmitted from "../../../../components/NeoComponents/AfterTransactionSubmitted";
import { useHistory } from "react-router-dom";
import { SMITH_PATH } from "../../../../../consts";
import Modal from "../../../../components/Modal";
import PageLayout from "../../../../components/Commons/PageLayout";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";
import { handleError } from "../../../../../packages/neo/utils/errors";
import { SMITH_NEP_FEE } from "../../../../../packages/neo/contracts/ftw/smith/consts";

const NEP17FormModal = () => {
  const { network, connectedWallet } = useWallet();
  const history = useHistory();
  const [txid, setTxid] = useState<string>();
  const [isBalanceLoading, setBalanceLoading] = useState(false);
  const [balances, setBalances] = useState<{
    gasBalance: number;
    nepBalance: number;
  }>({
    gasBalance: 0,
    nepBalance: 0
  });
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: "8",
    totalSupply: "",
    author: "",
    description: "",
    email: ""
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val
    });
  };
  const hasEmoji = detectEmojiInString(values) !== 0;
  const onMint = async () => {
    if (hasEmoji) {
      toast.error(
        "Emoji is not supported yet. Please remove emojis and try again."
      );
      return;
    }

    if (!connectedWallet) {
      toast.error("Please connect wallet.");
      return;
    }

    if (isBalanceLoading) {
      toast.error("Balance check hasn't been done. Please try again.");
      return;
    }

    if (balances.nepBalance < SMITH_NEP_FEE[network]) {
      toast.error("You don't have enough NEP for platform fee.");
      return;
    }

    if (balances.gasBalance < 10_00000000) {
      toast.error("You don't have enough GAS for deploy fee.");
      return;
    }

    try {
      const res = await new SmithContract(network).isNEP17SymbolTaken(
        values.symbol
      );
      if (res) {
        toast.error("Token symbol is already taken. Try other symbol.");
      } else {
        const res = await new SmithContract(network).createNEP17V3(
          connectedWallet,
          values.totalSupply,
          values.decimals,
          values.symbol,
          values.name,
          values.author,
          values.description,
          values.email
        );
        setTxid(res);
      }
    } catch (e: any) {
      toast.error(handleError(e));
    }
  };

  const onSuccess = () => {
    setTxid("");
    history.push(SMITH_PATH);
  };

  // const firstInput = useRef(null);

  useEffect(() => {
    // firstInput.current.focus();
    async function balanceCheck(w) {
      setBalanceLoading(true);
      try {
        const res = await new SmithContract(network).balanceCheck(w);
        setBalances(res);
        setBalanceLoading(false);
      } catch (e: any) {
        setBalanceLoading(false);
        console.error(e);
      }
    }
    if (connectedWallet) {
      balanceCheck(connectedWallet);
    }
  }, [connectedWallet, network]);

  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="columns">
            <div className="column is-8">
              <div className="box is-shadowless">
                <h1 className="title is-5">Token Contract</h1>
                <p className="subtitle is-6">
                  Create your token smart contract
                </p>
                <hr />

                <div className="field">
                  <label className="label">Token Name</label>
                  <div className="control">
                    <input
                      placeholder="My awesome token"
                      // ref={firstInput}
                      value={values.name}
                      onChange={(e) =>
                        handleValueChange("name", e.target.value)
                      }
                      className="input"
                      type="text"
                    />
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Token Symbol</label>
                      <div className="control">
                        <input
                          placeholder="XYZ"
                          value={values.symbol}
                          onChange={(e) =>
                            handleValueChange("symbol", e.target.value)
                          }
                          className="input"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Token Decimals</label>
                      <div className="control">
                        <NumberFormat
                          decimalScale={0}
                          inputMode="decimal"
                          className="input"
                          value={values.decimals}
                          onValueChange={(value) => {
                            handleValueChange("decimals", value.value);
                          }}
                          max={18}
                          allowNegative={false}
                          allowLeadingZeros={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Total Supply</label>
                  <div className="control">
                    <NumberFormat
                      placeholder="100,000,000"
                      thousandSeparator={true}
                      allowNegative={false}
                      decimalScale={0}
                      inputMode="decimal"
                      className="input"
                      value={values.totalSupply}
                      onValueChange={(value) => {
                        handleValueChange("totalSupply", value.value);
                      }}
                      allowLeadingZeros={false}
                    />
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Author</label>
                      <div className="control">
                        <input
                          placeholder="Author"
                          value={values.author}
                          onChange={(e) =>
                            handleValueChange("author", e.target.value)
                          }
                          className="input"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Email</label>
                      <div className="control">
                        <input
                          placeholder="Email"
                          value={values.email}
                          onChange={(e) =>
                            handleValueChange("email", e.target.value)
                          }
                          className="input"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">Description</label>
                  <div className="control">
                    <input
                      placeholder="Tell us about your token.."
                      value={values.description}
                      onChange={(e) =>
                        handleValueChange("description", e.target.value)
                      }
                      className="input"
                      type="text"
                    />
                  </div>
                </div>

                <hr />

                {hasEmoji && (
                  <div className="notification is-danger">
                    Emoji is not supported yet.
                  </div>
                )}

                {connectedWallet ? (
                  <button
                    onClick={onMint}
                    disabled={
                      !values.name ||
                      !values.symbol ||
                      !values.decimals ||
                      parseFloat(values.decimals) > 18 ||
                      parseFloat(values.totalSupply) < 1 ||
                      // !values.author ||
                      // !values.description ||
                      hasEmoji
                    }
                    className="button is-primary"
                  >
                    Create
                  </button>
                ) : (
                  <ConnectWalletButton />
                )}
              </div>
            </div>

            <div className="column is-4">
              <div className="box">
                <div className="content is-small">
                  <li>
                    We recommend to mint on <strong>Testnet</strong> first
                    before you mint on <strong>Mainnet</strong>.
                  </li>
                  <li>
                    Do not use <strong>EMOJI</strong> or{" "}
                    <strong>Unicode</strong>.
                  </li>
                  <li>FTWSwap cannot support tokens with 0 decimals.</li>
                  <li>
                    Deploy fee (Blockchain fee) is{" "}
                    <strong className="has-text-primary">10 GAS</strong>.
                  </li>
                  <li>
                    Service fee is{" "}
                    <strong className="has-text-primary">1000 NEP</strong>.
                  </li>
                  <li>
                    Your contract will <strong>not</strong> have a{" "}
                    <strong>update method</strong>.
                  </li>
                  <li>
                    Check contract source code at{" "}
                    <a
                      target="_blank"
                      href={
                        "https://github.com/ForTheWinn/public-contracts/blob/main/FTWSmithNep17-v3/FTWSmithNep17-v3.cs"
                      }
                    >
                      here
                    </a>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {txid && (
        <Modal onClose={() => setTxid("")}>
          <AfterTransactionSubmitted
            network={network}
            txid={txid}
            onSuccess={onSuccess}
            onError={() => setTxid("")}
          />
        </Modal>
      )}
    </PageLayout>
  );
};

export default NEP17FormModal;
