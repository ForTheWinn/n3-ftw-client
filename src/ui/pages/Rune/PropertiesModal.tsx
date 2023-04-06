import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { NFTContract } from "../../../packages/neo/contracts";
import { useApp } from "../../../common/hooks/use-app";

interface IPropertiesModal {
  tokenId: string;
  onClose: () => void;
}
const PropertiesModal = ({ tokenId, onClose }: IPropertiesModal) => {
  const [item, setItem] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { network } = useApp();
  useEffect(() => {
    async function fetchContractStatus() {
      setError("");
      setLoading(true);
      try {
        const res = await new NFTContract(network).getProperties(
          tokenId.toString()
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
        <>
          <h1 className="title is-4">{item.name}</h1>

          <p className="subtitle is-7">
            <strong>Phase:</strong> {item.phase}, <strong>Luck:</strong>{" "}
            {item.luck}
          </p>
          <figure className="image is-square">
            <img src={item.image} />
          </figure>
          <p className="subtitle is-7 has-text-right mt-3">{item.owner}</p>
        </>
      )}
    </Modal>
  );
};

export default PropertiesModal;
