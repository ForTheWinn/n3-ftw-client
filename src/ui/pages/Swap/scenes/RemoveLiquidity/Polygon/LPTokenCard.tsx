import React, { useEffect, useState } from "react";
import { getTokenURI } from "../../../../../../packages/polygon/api";
import { Buffer } from "buffer";

interface ILPTokenCard {
  tokenId: string;
  onClick: () => void;
}
const LPTokenCard = ({
  tokenId,
  onClick,
}: ILPTokenCard) => {
  const [token, setToken] = useState();
  useEffect(() => {
    const load = async (_tokenId: string) => {
      // setLoading(true);
      try {
        const res: any = await getTokenURI(parseFloat(_tokenId));
        const json = Buffer.from(res.substring(29), "base64").toString();
        console.log(json )
        const jsonObject = JSON.parse(json);
        setToken(jsonObject);
        console.log(jsonObject);
      } catch (e) {
        console.log(e);
      }
    };
    load(tokenId);
  }, [tokenId]);

  return (
    <div className="media">
      {/* <div className="media-content">
        <p className="mb-2">
          <strong>{tokenId}</strong>
          <br />
          <small>Share of pool / {sharePercentage}%</small>
          <br />
          <small>{`${tokenA} / ${tokenB}`}</small>
        </p>
      </div> */}
      <div className="media-right">
        <button onClick={onClick} className="button is-light is-small">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default LPTokenCard;
