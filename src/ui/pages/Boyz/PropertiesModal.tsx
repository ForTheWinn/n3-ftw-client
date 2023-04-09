import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { IBoy } from "../../../packages/neo/contracts/ftw/boyz/interface";
import { BoyzContract } from "../../../packages/neo/contracts/ftw/boyz";
import { useApp } from "../../../common/hooks/use-app";

interface IPropertiesModal {
  data: IBoy;
  onClose: () => void;
}

const boxStyle = {
  width: "300px",
  height: "300px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const PropertiesModal = ({ data, onClose }: IPropertiesModal) => {
  const [item, setItem] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { network } = useApp();

  useEffect(() => {
    async function fetchContractStatus() {
      setError("");
      setLoading(true);
      try {
        const res = await new BoyzContract(network).getProperties(
          `Boy_${data.no}`
        );
        setItem(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContractStatus();
  }, [network]);
  return (
    <Modal onClose={onClose}>
      {isLoading ? (
        <div>Loading the rune data from the chain..</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="has-text-centered">
          <h1 className="title is-4">{`Neo Boy #${data.no}`}</h1>
          <p className="subtitle is-7">Owner: {item.owner}</p>
          <div className="block">
            <div style={boxStyle}>
              <img src={data.image} />
            </div>
          </div>
          <div className="block">
            <div
              className="field is-grouped is-grouped-multiline"
              style={{ justifyContent: "center" }}
            >
              <div className="control">
                <span className="tag is-primary is-light">
                  Bg: {data.background}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Body: {data.body}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Clothing: {data.clothing}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Eyes: {data.eyes}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Head: {data.head}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Mouth: {data.mouth}
                </span>
              </div>
              <div className="control">
                <span className="tag is-primary is-light">
                  Acc: {data.accessory}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PropertiesModal;
