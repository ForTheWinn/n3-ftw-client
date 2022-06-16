import React, { useEffect, useRef, useState } from "react";
import { useWallet } from "../../../../../packages/provider";
import { toast } from "react-hot-toast";
import NumberFormat from "react-number-format";
import { SmithContract } from "../../../../../packages/neo/contracts/ftw/smith";
import { detectEmojiInString } from "../../helpers";
import AfterTransactionSubmitted from "../../../../../packages/ui/AfterTransactionSubmitted";
import { useHistory } from "react-router-dom";
import { SMITH_PATH } from "../../../../../consts";
import Modal from "../../../../components/Modal";
import PageLayout from "../../../../components/PageLayout";
import ConnectWalletButton from "../../../../components/ConnectWalletButton";

const NEP17FormModal = () => {
  const { network, connectedWallet } = useWallet();
  const history = useHistory();
  const [txid, setTxid] = useState<string>();
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: "8",
    totalSupply: "",
    author: "",
    description: "",
    email: "",
    website: "",
    logo: "",
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val,
    });
  };
  const hasEmoji = detectEmojiInString(values) !== 0;
  const onMint = async () => {
    if (hasEmoji) {
      toast.error(
        "Emoji is not supported yet. Please remove emojis and try again."
      );
    } else {
      if (connectedWallet) {
        // if (balanceCheck(connectedWallet.balances, 20)) {
        try {
          const res = await new SmithContract(network).isNEP17SymbolTaken(
            values.symbol
          );
          if (res) {
            toast.error("Token symbol is already taken. Try other symbol.");
          } else {
            const res = await new SmithContract(network).createNEP17V2(
              connectedWallet,
              values.totalSupply,
              values.decimals,
              values.symbol,
              values.name,
              values.author,
              values.description,
              values.email,
              values.website,
              values.logo
            );
            setTxid(res);
          }
        } catch (e: any) {
	        console.log(e);
	        toast.error("An error occurred, Check console.");
        }
        // } else {
        //   toast.error("You must have more than 20 GAS.");
        // }
      } else {
        toast.error("Please connect wallet.");
      }
    }
  };

  const onSuccess = () => {
    setTxid("");
    history.push(SMITH_PATH);
  };

  const firstInput = useRef(null);

  useEffect(() => {
    // @ts-ignore
    firstInput.current.focus();
  }, []);

  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="columns">
            <div className="column is-8">
              <div className="box is-shadowless">
                <h1 className="title is-4">Token Contract</h1>
                <p className="subtitle is-6">
                  Create your own token smart contract
                </p>
                <hr />

                <div className="field">
                  <label className="label">Token Name</label>
                  <div className="control">
                    <input
                      placeholder="My awesome token"
                      ref={firstInput}
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

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label">Website</label>
                      <div className="control">
                        <input
                          placeholder="Optional"
                          value={values.website}
                          onChange={(e) =>
                            handleValueChange("website", e.target.value)
                          }
                          className="input"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">Logo</label>
                      <div className="control">
                        <input
                          placeholder="Optional"
                          value={values.logo}
                          onChange={(e) =>
                            handleValueChange("logo", e.target.value)
                          }
                          className="input"
                          type="text"
                        />
                      </div>
                    </div>
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
                  <li>
                    Deploy fee is <strong>10 GAS</strong>.
                  </li>
                  <li>FTWSwap cannot support tokens with 0 decimals</li>
                  <li>
                    Check contract source code at{" "}
                    <a
                      target="_blank"
                      href={
                        "https://github.com/ForTheWinn/public-contracts/blob/main/FTWSmithNep17-v2/FTWSmithNep17-v2.cs"
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
