import React, { useState } from "react";
import NumberFormat from "react-number-format";
import { SmithContract } from "../../../../../../../packages/neo/contracts/ftw/smith";
import { detectEmojiInString } from "../../helpers";
import { useHistory } from "react-router-dom";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { SMITH_PATH } from "../../../../../../../consts/routes";

import PageLayout from "../../../../../../components/Commons/PageLayout";
import ConnectWalletButton from "../../../../../../components/ConnectWalletButton";
import { SMITH_FEE } from "../../../../../../../consts/smith";
import NEOSmithActionModal from "./NEOActionModal";
import { Modal, message } from "antd";
import { WENT_WRONG } from "../../../../../../../consts/messages";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import { useBalances } from "../../../../../../../packages/neo/hooks/use-balances";
import {
  NEO_GAS_CONTRACT_ADDRESS,
  NEO_NEP_CONTRACT_ADDRESS,
} from "../../../../../../../packages/neo/consts/neo-contracts";
import { withDecimal } from "../../../../../../../packages/neo/utils";

const CreateToken = () => {
  const { chain, network } = useApp();
  const history = useHistory();
  const [txid, setTxid] = useState<string | undefined>();
  const { client, address } = useWalletRouter(chain);
  const smithFee = withDecimal(SMITH_FEE[chain][network], 8, true);
  const [values, setValues] = useState({
    name: "",
    symbol: "",
    decimals: "8",
    totalSupply: "",
    author: "",
    description: "",
    email: "",
  });

  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val,
    });
  };

  const hasEmoji = detectEmojiInString(values) !== 0;

  const onMint = async () => {
    try {
      if (hasEmoji) {
        message.error(
          "Emoji is not supported yet. Please remove emojis and try again."
        );
        return;
      }

      const balances = await useBalances(network, address, [
        NEO_GAS_CONTRACT_ADDRESS,
        NEO_NEP_CONTRACT_ADDRESS[network],
      ]);

      if (balances[1] < parseFloat(smithFee)) {
        message.error("You don't have enough NEP.");
        return;
      }

      if (balances[0] < 10) {
        message.error("You don't have enough GAS.");
        return;
      }

      const res = await new SmithContract(network).createNEP17V3(
        client,
        values.totalSupply,
        values.decimals,
        values.symbol,
        values.name,
        values.author,
        values.description,
        values.email
      );
      setTxid(res);
    } catch (e: any) {
      message.error(e.message ? e.message : WENT_WRONG);
    }
  };

  const onSuccess = () => {
    setTxid(undefined);
    history.push(SMITH_PATH);
  };

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
                      value={values.name}
                      onChange={(e) =>
                        handleValueChange("name", e.target.value)
                      }
                      className="input is-shadowless"
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
                          className="input is-shadowless"
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
                          className="input is-shadowless"
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
                      className="input is-shadowless"
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
                      <label className="label">
                        Author{" "}
                        <span className="is-size-7 has-text-weight-light">
                          (Optional)
                        </span>
                      </label>
                      <div className="control">
                        <input
                          placeholder="Author"
                          value={values.author}
                          onChange={(e) =>
                            handleValueChange("author", e.target.value)
                          }
                          className="input is-shadowless"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column">
                    <div className="field">
                      <label className="label">
                        Email{" "}
                        <span className="is-size-7 has-text-weight-light">
                          (Optional)
                        </span>
                      </label>
                      <div className="control">
                        <input
                          placeholder="Email"
                          value={values.email}
                          onChange={(e) =>
                            handleValueChange("email", e.target.value)
                          }
                          className="input is-shadowless"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label">
                    Description{" "}
                    <span className="is-size-7 has-text-weight-light">
                      (Optional)
                    </span>
                  </label>
                  <div className="control">
                    <input
                      placeholder="Tell us about your token.."
                      value={values.description}
                      onChange={(e) =>
                        handleValueChange("description", e.target.value)
                      }
                      className="input is-shadowless"
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

                {client ? (
                  <button
                    onClick={onMint}
                    disabled={
                      !values.name ||
                      !values.symbol ||
                      !values.decimals ||
                      parseFloat(values.decimals) > 18 ||
                      parseFloat(values.totalSupply) < 1 ||
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
              <div className="box is-shadowless">
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
                    <strong className="has-text-primary">{`${smithFee} NEP`}</strong>
                    .
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
      </div>

      {txid && (
        <Modal
          closable={false}
          onCancel={() => setTxid(undefined)}
          open={true}
          footer={null}
        >
          <NEOSmithActionModal
            network={network}
            txid={txid}
            onSuccess={onSuccess}
            onError={() => setTxid(undefined)}
          />
        </Modal>
      )}
    </PageLayout>
  );
};

export default CreateToken;
