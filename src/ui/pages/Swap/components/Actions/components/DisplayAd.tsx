import React from "react";
import NFTAds from "../../../../../components/Ad";
import { Typography } from "antd";
import LoadingWithText from "../../../../../components/Commons/LoadingWithText";

export const DisplayAd = () => {
  return (
    <div className="has-text-centered">
      <NFTAds />
      <Typography.Text>
        <LoadingWithText title="Transaction is being confirmed" />
      </Typography.Text>
    </div>
  );
};
