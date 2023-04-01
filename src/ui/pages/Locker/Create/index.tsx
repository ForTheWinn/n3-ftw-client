import React, { useEffect, useState } from "react";
import { useWallet } from "../../../../packages/neo/provider";
import toast from "react-hot-toast";
import Modal from "../../../components/Modal";
import AfterTransactionSubmitted from "../../../components/NeoComponents/AfterTransactionSubmitted";
import DatePicker from "react-datepicker";
import SelectTokenContract from "./SelectTokenContract";
import NumberFormat from "react-number-format";
import { LockerContract } from "../../../../packages/neo/contracts/ftw/locker";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { wallet } from "@cityofzion/neon-core";
import { SmithContract } from "../../../../packages/neo/contracts/ftw/smith";
import { LOCKER_NEP_FEE } from "../../../../packages/neo/contracts/ftw/locker/consts";
import { NEO_ROUTES } from "../../../../consts";

export interface IContractState {
  assetHash: string;
  symbol: string;
  decimals: number;
}

const Create = () => {
  const location = useLocation();
  const history = useHistory();
  const params = queryString.parse(location.search);
  const { network, connectedWallet } = useWallet();
  const [contract, setContractHash] = useState<IContractState | undefined>(
    undefined
  );
  const [receiver, setReceiver] = useState(
    connectedWallet ? connectedWallet.account.address : ""
  );
  const [amount, setAmount] = useState<number | undefined>(0);
  const [title, setTile] = useState("");
  const [description, setDescription] = useState("");
  const [releaseAt, setReleaseAt] = useState(
    new Date(Date.now() + 3600 * 1000 * 24)
    // new Date(Date.now())
  );
  const [txid, setTxid] = useState("");
  const [balances, setBalances] = useState<{
    gasBalance: number;
    nepBalance: number;
  }>({
    gasBalance: 0,
    nepBalance: 0
  });

  const onSubmit = async () => {
    if (connectedWallet && contract && receiver && amount) {
      if (!wallet.isAddress(receiver)) {
        toast.error("Please check receiver");
        return;
      }

      if (balances.nepBalance < LOCKER_NEP_FEE[network]) {
        toast.error("You don't have enough NEP for platform fee.");
        return;
      }

      try {
        const res = await new LockerContract(network).create(
          connectedWallet,
          contract,
          receiver,
          amount,
          moment(releaseAt).valueOf(),
          title,
          description
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toast.error("Connect your wallet");
    }
  };

  const handleContractChange = (contract: IContractState | undefined) => {
    setContractHash(contract);
  };

  const onSuccess = () => {
    if (connectedWallet) {
      history.push(`${NEO_ROUTES.LOCKER_USER_PATH}/${connectedWallet.account.address}`);
    }
  };

  // const hasEmoji = useMemo(() => {
  //   return emojiRegexExp.test(description);
  // }, [description]);

  useEffect(() => {
    async function fetch() {
      try {
        if (params && params.contractHash) {
          const contract = await new LockerContract(network).getContract(
            params.contractHash
          );
          setContractHash({
            assetHash: contract.contractHash,
            decimals: contract.decimals,
            symbol: contract.symbol
          });
        }

        if (connectedWallet) {
          const res = await new SmithContract(network).balanceCheck(
            connectedWallet
          );
          setBalances(res);
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
                    Fee is{" "}
                    <span className="has-text-primary has-text-weight-bold">
                      {" "}
                      100 NEP
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
    </div>
  );
};

export default Create;
