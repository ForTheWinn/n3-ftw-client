import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../../../../common/hooks/use-neo-wallets";
import { toast } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { useApp } from "../../../../../../../common/hooks/use-app";

import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { detectEmojiInString } from "../../helpers";

import { handleError } from "../../../../../../../packages/neo/utils/errors";
import { SMITH_PATH_NEP11 } from "../../../../../../../consts/routes";

import Modal from "../../../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../../components/NeoComponents/AfterTransactionSubmitted";
import PageLayout from "../../../../../../components/Commons/PageLayout";
import { SMITH_FEE } from "../../../../../../../consts/smith";
import { NEO_CHAIN } from "../../../../../../../consts/global";

const NEP11FormModal = () => {
  const history = useHistory();
  const { network } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [txid, setTxid] = useState<string>();
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    author: "",
    description: "",
    email: ""
  });
  const [isBalanceLoading, setBalanceLoading] = useState(false);
  const [balances, setBalances] = useState<{
    gasBalance: number;
    nepBalance: number;
  }>({
    gasBalance: 0,
    nepBalance: 0
  });

  const hasEmoji = detectEmojiInString(values) !== 0;

  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val
    });
  };

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

    if (balances.nepBalance < SMITH_FEE[NEO_CHAIN][network]) {
      toast.error("You don't have enough NEP for platform fee.");
      return;
    }

    if (balances.gasBalance < 10_00000000) {
      toast.error("You don't have enough GAS for deploy fee.");
      return;
    }

    try {
      const res = await new SmithContract(network).isNEP11SymbolTaken(
        values.symbol
      );
      if (res) {
        toast.error("Token symbol is already taken. Try other symbol.");
      } else {
        const res = await new SmithContract(network).createNEP11(
          connectedWallet,
          values.name,
          values.symbol,
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
    history.push(SMITH_PATH_NEP11);
  };

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
    <>
      <PageLayout>
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <div className="columns">
              <div className="column is-8">
                <div className="box is-shadowless">
                  <h1 className="title is-5">NFT Contract</h1>
                  <p className="subtitle is-6">
                    Create your NFT smart contract
                  </p>
                  <hr />
                  <div className="field">
                    <label className="label">NFT Contract Name</label>
                    <div className="control">
                      <input
                        placeholder="My bored club"
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
                  <div className="field">
                    <label className="label">NFT Symbol</label>
                    <div className="control">
                      <input
                        placeholder="MYNFT"
                        value={values.symbol}
                        onChange={(e) =>
                          handleValueChange("symbol", e.target.value)
                        }
                        className="input"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="columns">
                    <div className="column">
                      <div className="field">
                        <label className="label">Author</label>
                        <div className="control">
                          <input
                            placeholder="Optional"
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
                            placeholder="Optional"
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
                        placeholder="Optional"
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
                  <button
                    onClick={onMint}
                    disabled={
                      !values.name ||
                      !values.symbol ||
                      // !values.author ||
                      // !values.description ||
                      // !values.email ||
                      hasEmoji
                    }
                    className="button is-primary"
                  >
                    Create
                  </button>
                </div>
              </div>
              <div className="column is-4">
                <div className="box is-shadowless content is-small">
                  <li>
                    We recommend to mint on <strong>Testnet</strong> first
                    before you mint on <strong>Mainnet</strong>.
                  </li>
                  <li>
                    Do not use <strong>EMOJI</strong> or{" "}
                    <strong>Unicode</strong>.
                  </li>
                  <li>
                    You will be able to mint your NFTs in your contract page
                    after deployment.
                  </li>
                  <li>
                    Deploy fee (Blockchain fee) is{" "}
                    <strong className="has-text-primary">10 GAS</strong>.
                  </li>
                  <li>
                    Service fee is{" "}
                    <strong className="has-text-primary">1000 NEP</strong>.
                  </li>

                  <li>
                    Check contract source code at{" "}
                    <a
                      target="_blank"
                      href={
                        "https://github.com/ForTheWinn/public-contracts/blob/main/FTWSmithNep11/FTWSmithNep11.cs"
                      }
                      rel="noreferrer"
                    >
                      here
                    </a>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
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
    </>
  );
};

export default NEP11FormModal;
