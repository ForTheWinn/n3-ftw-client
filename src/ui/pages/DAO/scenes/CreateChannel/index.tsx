import React, { useState } from "react";
import { detectEmojiInString } from "../../../Tools/scenes/Smith/helpers";
import { DaoContract } from "../../../../../packages/neo/contracts/ftw/dao";
import toast from "react-hot-toast";
import { useNeoWallets } from "../../../../../common/hooks/use-neo-wallets";
import { Link, useHistory } from "react-router-dom";
import PageLayout from "../../../../components/Commons/PageLayout";
import VerifyContract from "./VerifyContract";
import ChannelForm from "../../components/ChannelForm";
import { useApp } from "../../../../../common/hooks/use-app";
import { DAO_PATH } from "../../../../../consts/routes";

interface IAddChannelProps {
  onAdd: (values) => void;
}
const CreateChannel = ({ onAdd }: IAddChannelProps) => {
  const history = useHistory();
  const { network, setTxid } = useApp();
  const { connectedWallet } = useNeoWallets();
  const [values, setValues] = useState({
    symbol: "",
    contractHash: "",
    decimals: "",
    minTokens: "",
    logo: ""
  });

  const hasEmoji = detectEmojiInString(values) !== 0;

  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val
    });
  };

  const handleVerifiedContract = (
    contractHash: string,
    symbol: string,
    decimals: string
  ) => {
    setValues({
      ...values,
      contractHash,
      symbol,
      decimals
    });
  };

  const handleAddChannel = async () => {
    if (connectedWallet) {
      const manifest = JSON.stringify({
        logo: values.logo
      });
      const txid = await new DaoContract(network).createChannel(
        connectedWallet,
        values.contractHash,
        values.decimals,
        values.minTokens,
        manifest
      );
      setTxid(txid);
    } else {
      toast.error("Connect your wallet");
    }
  };

  const handleTxSuccess = () => {
    setTxid("");
    history.push(DAO_PATH);
  };

  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <Link to={DAO_PATH} className="button is-rounded is-small mb-3">
            Back to list
          </Link>

          <div className="columns">
            <div className="column is-8">
              <div className="box is-shadowless">
                <h1 className="title is-5 is-marginless">Add a new channel</h1>
                <hr />
                {values.contractHash ? (
                  <div>
                    <ChannelForm values={values} onChange={handleValueChange} />
                    <button
                      disabled={
                        values.minTokens === "" ||
                        values.minTokens === "0" ||
                        !values.logo
                      }
                      onClick={handleAddChannel}
                      className="button is-primary mt-5"
                    >
                      Create a channel
                    </button>
                  </div>
                ) : (
                  <VerifyContract
                    onVerify={handleVerifiedContract}
                    network={network}
                    connectedWallet={connectedWallet}
                  />
                )}
              </div>
            </div>

            <div className="column is-4">
              <div className="box is-shadowless content is-small">
                <li>
                  You need to be the contract owner to create DAO channel.
                </li>
                <li>
                  We automatically detect your contract ownership if your
                  contract deployed with FTWSmith.
                </li>
                <li>
                  Please contact FTW team for whitelisting if your contract
                  didn't launch by FTWSmith.
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateChannel;
