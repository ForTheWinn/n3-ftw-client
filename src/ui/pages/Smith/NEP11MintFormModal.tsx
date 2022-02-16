import React, { useState } from "react";
import Modal from "../../components/Modal";
import { useWallet } from "../../../packages/provider";
import { toast } from "react-hot-toast";
import { SmithContract } from "../../../packages/neo/contracts/ftw/smith";
import AfterTransactionSubmitted from "../../../packages/ui/AfterTransactionSubmitted";

interface IActionModal {
  contractHash: string;
  onClose: () => void;
}
const NEP11MintFormModal = ({ contractHash, onClose }: IActionModal) => {
  const { network, connectedWallet } = useWallet();
  const [txid, setTxid] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    attributes: {},
  });
  const [attValues, setAttValues] = useState({
    key: "",
    value: "",
  });
  const handleValueChange = (key: string, val: string) => {
    setValues({
      ...values,
      [key]: val,
    });
  };

  const handleAttChange = (key: string, val: string) => {
    setAttValues({
      ...attValues,
      [key]: val,
    });
  };

  const handleAttributes = () => {
    if (attValues.key && attValues.value) {
      // @ts-ignore
      const attributes = values.attributes;
      attributes[attValues.key] = attValues.value;
      setValues({
        ...values,
        attributes,
      });
      setAttValues({
        key: "",
        value: "",
      });
    }
  };

  const onMint = async () => {
    if (connectedWallet) {
      try {
        const res = await new SmithContract(network).mintNFT(
          connectedWallet,
          contractHash,
          values.name,
          values.description,
          values.image,
          JSON.stringify(values.attributes)
        );
        setTxid(res);
      } catch (e: any) {
        toast.error(e.message);
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };

  const attKeys = Object.keys(values.attributes);
  return (
    <Modal onClose={onClose}>
      {txid ? (
        <AfterTransactionSubmitted
          network={network}
          txid={txid}
          onSuccess={onClose}
          onError={() => setTxid("")}
        />
      ) : (
        <>
          <h1 className="title">Mint a NFT</h1>
          <hr />
          <div className="field">
            <label className="label">NFT Name</label>
            <div className="control">
              <input
                value={values.name}
                onChange={(e) => handleValueChange("name", e.target.value)}
                className="input"
                type="text"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">NFT Description</label>
            <div className="control">
              <input
                value={values.description}
                onChange={(e) =>
                  handleValueChange("description", e.target.value)
                }
                className="input"
                type="text"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">NFT Image</label>
            <div className="control">
              <input
                value={values.image}
                onChange={(e) => handleValueChange("image", e.target.value)}
                className="input"
                type="text"
              />
            </div>
          </div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <label className="label">NFT Attributes</label>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="button is-dark"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="block">
            <div className="field is-grouped is-grouped-multiline">
              {attKeys.map((k) => {
                return (
                  <div className="control">
                    <div className="tags has-addons">
                      <span className="tag is-dark">{k}</span>
                      <span className="tag is-info">
                        {values.attributes[k]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {showForm && (
            <div className="block">
              <div className="columns is-mobile">
                <div className="column is-5">
                  <div className="control">
                    <input
                      placeholder="KEY"
                      value={attValues.key}
                      onChange={(e) => handleAttChange("key", e.target.value)}
                      className="input"
                      type="text"
                    />
                  </div>
                </div>
                <div className="column">
                  <div className="control is-5">
                    <input
                      placeholder="VALUE"
                      value={attValues.value}
                      onChange={(e) => handleAttChange("value", e.target.value)}
                      className="input"
                      type="text"
                    />
                  </div>
                </div>
                <div className="column is-2">
                  <button
                    disabled={!attValues.key || !attValues.value}
                    onClick={handleAttributes}
                    className="button"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          <hr />
          <button
            onClick={onMint}
            disabled={!values.name || !values.description || !values.image}
            className="button is-primary"
          >
            Create
          </button>
        </>
      )}
    </Modal>
  );
};

export default NEP11MintFormModal;