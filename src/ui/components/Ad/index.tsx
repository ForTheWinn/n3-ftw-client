import React, { useEffect, useState } from "react";
import { RestAPI } from "../../../packages/neo/api";
import { useApp } from "../../../common/hooks/use-app";

const API_ENDPOINT = "your-api-endpoint"; // Replace with your actual API endpoint

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const NFTAds = () => {
  const { network } = useApp();
  const [nftData, setNftData] = useState<any>({
    no: 1065,
    image: "/boyz/1065.png",
  });

  useEffect(() => {
    const fetchNFT = async () => {
      const no = getRandomInt(1, 1111);
      try {
        const data = await new RestAPI(network).getBoy(no);
        setNftData(data);
      } catch (err) {
        console.error(`Failed to fetch NFT: ${err}`);
      }
    };

    fetchNFT();

    const intervalId = setInterval(fetchNFT, 3000);

    // clean up on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="has-text-centered">
        <figure className="image is-128x128" style={{ margin: "0 auto" }}>
          <img src={nftData.image} alt={`NFT ${nftData.no}`} />
        </figure>
        <p className="heading is-size-6-mobile">Neo Boyz #{nftData.no}</p>
      </div>
    </>
  );
};

export default NFTAds;
