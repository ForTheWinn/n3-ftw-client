import React from "react";
import PageLayout from "./Commons/PageLayout";
import { INetworkType } from "../../packages/neo/network";

const ProductNotSupportedInNetwork = ({
  title,
  network,
}: {
  title: string;
  network: INetworkType;
}) => {
  return (
    <PageLayout>
      <div className="box is-shadowless">
        {title} is not supported in {network}. Check your network setting.
      </div>
    </PageLayout>
  );
};

export default ProductNotSupportedInNetwork;
