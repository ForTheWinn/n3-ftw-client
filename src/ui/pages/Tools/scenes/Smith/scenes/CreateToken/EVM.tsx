import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NumberFormat from "react-number-format";
import { detectEmojiInString } from "../../helpers";
import { useHistory } from "react-router-dom";
import { useApp } from "../../../../../../../common/hooks/use-app";
import { SMITH_PATH } from "../../../../../../../consts/routes";

import PageLayout from "../../../../../../components/Commons/PageLayout";
import ConnectWalletButton from "../../../../../../components/ConnectWalletButton";
import { useWalletRouter } from "../../../../../../../common/hooks/use-wallet-router";
import EVMActionModal from "./EVMActionModal";
import { SMITH_FEE_FORMATTED } from "../../../../../../../consts/smith";

export interface ITokenMetadata {
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: string;
  website: string;
  icon: string;
}

const CreateToken = () => {
  const history = useHistory();
  const { network, chain } = useApp();
  const { address, isConnected } = useWalletRouter(chain);

  const [isActionModalActive, setActionModalActive] = useState(false);
  const [userAgreement, setUserAgreement] = useState(false);

  const [values, setValues] = useState<ITokenMetadata>({
    name: "",
    symbol: "",
    decimals: "18",
    totalSupply: "",
    website: "",
    icon: "",
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
      return;
    }

    if (!isConnected) {
      toast.error("Please connect wallet.");
      return;
    }

    setActionModalActive(true);
  };

  const onSuccess = () => {
    setActionModalActive(false);
    history.push(SMITH_PATH);
  };

  const onReset = () => {
    setActionModalActive(false);
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
                      // ref={firstInput}
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

                <div className="field">
                  <label className="label">
                    Website{" "}
                    <span className="is-size-7 has-text-weight-light">
                      (Optional)
                    </span>
                  </label>

                  <div className="control">
                    <input
                      placeholder="https://"
                      value={values.website}
                      onChange={(e) =>
                        handleValueChange("website", e.target.value)
                      }
                      className="input is-shadowless"
                      type="text"
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">
                    Icon{" "}
                    <span className="is-size-7 has-text-weight-light">
                      (Optional)
                    </span>
                  </label>

                  <div className="control">
                    <input
                      placeholder="https://"
                      value={values.icon}
                      onChange={(e) =>
                        handleValueChange("icon", e.target.value)
                      }
                      className="input is-shadowless"
                      type="text"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="checkbox has-text-weight-light">
                    <input
                      onClick={() => setUserAgreement(!userAgreement)}
                      className="pr-3"
                      type="checkbox"
                      checked={userAgreement}
                    />{" "}
                    I understand and agree that I am fully responsible for the
                    management of my tokens created through Smith. FTW is not
                    liable for any actions or consequences related to these
                    tokens.
                  </label>
                </div>

                <hr />

                {hasEmoji && (
                  <div className="notification is-danger">
                    Emoji is not supported yet.
                  </div>
                )}

                {isConnected ? (
                  <button
                    onClick={onMint}
                    disabled={
                      !values.name ||
                      !values.symbol ||
                      !values.decimals ||
                      !values.decimals ||
                      !values.totalSupply ||
                      parseFloat(values.totalSupply) < 1 ||
                      !userAgreement ||
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
                  <li>
                    Service fee is{" "}
                    <strong className="has-text-primary">{`${SMITH_FEE_FORMATTED[chain][network]} NEP`}</strong>
                    .
                  </li>
                  <li>
                    Smith uses ERC20Upgradeable but your contract will not be
                    upgradable.
                  </li>
                  <li>
                    Check contract source code at{" "}
                    <a
                      target="_blank"
                      href={
                        "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/ERC20Upgradeable.sol"
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

      {isActionModalActive && (
        <EVMActionModal
          address={address}
          name={values.name}
          symbol={values.symbol}
          decimals={values.decimals}
          totalSupply={values.totalSupply}
          website={values.website}
          icon={values.icon}
          chain={chain}
          network={network}
          onSuccess={onSuccess}
          onCancel={onReset}
        />
      )}
    </PageLayout>
  );
};

export default CreateToken;
