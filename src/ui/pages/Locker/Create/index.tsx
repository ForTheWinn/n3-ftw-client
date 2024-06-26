import React, { useEffect, useState } from "react";
import { useNeoWallets } from "../../../../common/hooks/use-neo-wallets";
import DatePicker from "react-datepicker";
import SelectTokenContract from "./SelectTokenContract";
import NumberFormat from "react-number-format";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { wallet } from "@cityofzion/neon-core";
import { LOCKER_NEP_FEE } from "../../../../packages/neo/contracts/ftw/locker/consts";
import { useApp } from "../../../../common/hooks/use-app";
import { LOCKER_USER_PATH } from "../../../../consts/routes";
import { IToken } from "../../../../consts/tokens";
import { message } from "antd";
import { toDecimal, useBalances } from "../../../../packages/neo/utils";
import { NEO_NEP_CONTRACT_ADDRESS } from "../../../../packages/neo/consts/tokens";

const Create = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [contract, setContractHash] = useState<IToken | undefined>(undefined);
  const [receiver, setReceiver] = useState(
    connectedWallet ? connectedWallet.account.address : ""
  );
  const [amount, setAmount] = useState<number | undefined>(0);
  const [keys, setKeys] = useState<number | undefined>(1);
  const [title, setTile] = useState("");
  const [description, setDescription] = useState("");
  const [releaseAt, setReleaseAt] = useState(
    new Date(Date.now() + 3600 * 1000 * 24)
  );
  const lockerFee = toDecimal(LOCKER_NEP_FEE[network], 8);

  const onSubmit = async () => {
    if (connectedWallet && contract && receiver && amount) {
      if (!wallet.isAddress(receiver)) {
        message.error("Please check receiver");
        return;
      }

      const balances = await useBalances(
        network,
        connectedWallet.account.address,
        [NEO_NEP_CONTRACT_ADDRESS[network]]
      );

      if (balances[0] < lockerFee) {
        message.error("You don't have enough NEP.");
        return;
      }

      // if (keys === 0 || keys === undefined || keys > 10) {
      //   message.error("Lockers needs to be 1 ~ 10.");
      //   return;
      // }

      try {
        const res = await new LockerContract(network).create(
          connectedWallet,
          contract,
          receiver,
          amount,
          moment(releaseAt).valueOf(),
          title,
          description,
          keys
        );
        setTxid(res);
      } catch (e: any) {
        message.error(e.message);
      }
    } else {
      message.error("Connect your wallet");
    }
  };

  const handleContractChange = (contract: IToken | undefined) => {
    setContractHash(contract);
  };

  const onSuccess = () => {
    if (connectedWallet) {
      history.push(`${LOCKER_USER_PATH}/${connectedWallet.account.address}`);
    }
  };

  useEffect(() => {
    async function fetch() {
      try {
        if (params && params.hash) {
          const contract = await new LockerContract(network).getContract(
            params.hash
          );
          setContractHash({
            hash: contract.contractHash,
            decimals: contract.decimals,
            symbol: contract.symbol,
            icon: "",
          });
        }
      } catch (e: any) {
        console.error(e);
      }
    }
    fetch();
  }, [network, connectedWallet]);

  return (
    <div className="columns">
      <div className="column is-8 is-offset-2">
        <div className="columns">
          <div className="column is-8">
            <div className="box is-shadowless">
              <h5 className="title is-5">Create a new locker</h5>
              <hr />

              <SelectTokenContract
                contract={contract}
                onContractChange={handleContractChange}
              />

              <div className="field">
                <label className="label">Receiver</label>
                <div className="control">
                  <input
                    placeholder="Receiver address"
                    onChange={(e) => setReceiver(e.target.value)}
                    className="input"
                    type="text"
                    value={receiver}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Amount</label>
                <div className="control">
                  <NumberFormat
                    disabled={!contract}
                    allowLeadingZeros={false}
                    suffix={contract ? ` ${contract.symbol}` : undefined}
                    thousandSeparator={true}
                    allowNegative={false}
                    decimalScale={contract ? contract.decimals : 0}
                    inputMode="decimal"
                    className="input"
                    placeholder={"Amount"}
                    value={amount}
                    onValueChange={(value) => {
                      setAmount(value.floatValue);
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Release at</label>
                <DatePicker
                  className="input"
                  selected={releaseAt}
                  onChange={(date) => setReleaseAt(date)}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  minDate={releaseAt}
                />
              </div>

              {/* {isMultiInvoke ? (
                <div className="field">
                  <label className="label">Lockers</label>
                  <div className="control">
                    <NumberFormat
                      max={10}
                      disabled={!contract}
                      allowLeadingZeros={false}
                      allowNegative={false}
                      decimalScale={0}
                      className="input"
                      value={keys}
                      onValueChange={(value) => {
                        setKeys(value.floatValue);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsMultiInvoke(true)}
                  className="button is-light is-small"
                >
                  Do you need more than 1 locker?
                </button>
              )} */}

              <hr />

              {/*<div className="field">*/}
              {/*  <label className="label">Locker name</label>*/}
              {/*  <div className="control">*/}
              {/*    <input*/}
              {/*      placeholder="Locker name"*/}
              {/*      onChange={(e) => setTile(e.target.value)}*/}
              {/*      className="input"*/}
              {/*      type="text"*/}
              {/*      value={title}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*<div className="field">*/}
              {/*  <label className="label">Description</label>*/}
              {/*  <div className="control">*/}
              {/*    <MDEditor*/}
              {/*      value={description}*/}
              {/*      onChange={(value, event, state) => {*/}
              {/*        setDescription(value ? value : "");*/}
              {/*      }}*/}
              {/*      previewOptions={{*/}
              {/*        rehypePlugins: [[rehypeSanitize]],*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              {/*<hr />*/}

              <button
                disabled={!contract || !receiver || !amount}
                onClick={onSubmit}
                className="button is-primary"
              >
                Create a locker
              </button>
            </div>
          </div>
          <div className="column is-4">
            <>
              <div className="box is-shadowless">
                <div className="content is-small">
                  <li>
                    Fee:{" "}
                    <span className="has-text-primary has-text-weight-bold">
                      {" "}
                      {lockerFee} NEP
                    </span>
                  </li>
                  <li>
                    There is no way to get tokens back earlier than the release
                    time.
                  </li>
                  <li>
                    Do not use <strong>Emojis</strong>.
                  </li>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
