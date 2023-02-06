import React, { useEffect, useState } from "react";
import PageLayout from "../../../../../components/Commons/PageLayout";
import { Link, useHistory, useParams } from "react-router-dom";
import { DAO_CHANNEL_PATH } from "../../../../../../consts";
import ChannelForm from "../../../components/ChannelForm";
import Modal from "../../../../../components/Modal";
import AfterTransactionSubmitted from "../../../../../components/NeoComponents/AfterTransactionSubmitted";
import { useWallet } from "../../../../../../packages/provider";
import { DaoContract } from "../../../../../../packages/neo/contracts/ftw/dao";
import toast from "react-hot-toast";
import { u } from "@cityofzion/neon-core";

const Edit = () => {
  const params = useParams();
  const history = useHistory();
  const { contractHash } = params as any;
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState<string>();
  // const [refresh, setRefresh] = useState<string>();
  const [values, setValues] = useState<any>();

  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val,
    });
  };

  const handleAddChannel = async () => {
    if (connectedWallet && values.decimals) {
      const manifest = JSON.stringify({
        logo: values.logo,
      });
      const txid = await new DaoContract(network).editChannel(
        connectedWallet,
        contractHash,
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
    history.push(`${DAO_CHANNEL_PATH}/${contractHash}`);
  };

  useEffect(() => {
    async function fetch() {
      try {
        const res = await new DaoContract(network).getChannel(contractHash);
        const manifest = DaoContract.getMetadata(res.manifest);
        setValues({
          minTokens: u.BigInteger.fromNumber(res.minTokens).toDecimal(
            res.decimals
          ),
          logo: manifest.logo,
          decimals: res.decimals as any,
          symbol: res.symbol as string,
        });
      } catch (e: any) {}
    }
    fetch();
  }, []);
  if (!values) return <div />;
  return (
    <PageLayout>
      <div className="columns  is-center">
        <div className="column is-half ">
          <Link
            to={`${DAO_CHANNEL_PATH}/${contractHash}`}
            className="button is-rounded is-small mb-3"
          >
            Back to list
          </Link>

          <div className="box is-shadowless">
            <h1 className="title is-5 is-marginless">Edit channel</h1>
            <hr />
            <div>
              <ChannelForm values={values} onChange={handleValueChange} />
              <div className="mt-5">
                <button
                  disabled={
                    values.minTokens === "" ||
                    values.minTokens === "0" ||
                    !values.logo
                  }
                  onClick={handleAddChannel}
                  className="button is-primary"
                >
                  Create a channel
                </button>
              </div>
            </div>

            {txid && (
              <Modal onClose={() => setTxid("")}>
                <AfterTransactionSubmitted
                  network={network}
                  txid={txid}
                  onSuccess={handleTxSuccess}
                  onError={() => setTxid("")}
                />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Edit;
