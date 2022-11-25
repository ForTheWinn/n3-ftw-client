import React, { useEffect, useState } from "react";
import { BoyzContract } from "../../../../../packages/neo/contracts/ftw/boyz";
import { IBoy } from "../../../../../packages/neo/contracts/ftw/boyz/interface";
import { INetworkType } from "../../../../../packages/neo/network";

interface IDisplayBoyProps {
  id: string;
  network: INetworkType;
  onClick: () => void;
}
const DisplayBoy = ({ id, network, onClick }: IDisplayBoyProps) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<IBoy>();
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await new BoyzContract(network).getProperties(id);
        setData(res as IBoy);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }
    if (id) {
      load();
    } else {
      setLoading(false);
    }
  }, [id]);
  if (isLoading) return <></>;
  return (
    <div>
      <img
        className="is-clickable"
        onClick={onClick}
        src={data ? data.image : "/boyz/thumb.png"}
      />
    </div>
  );
};

export default DisplayBoy;
