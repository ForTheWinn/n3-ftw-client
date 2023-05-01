import React from "react";
import PageLayout from "../../components/Commons/PageLayout";
import { Space } from "antd";

const Consensus2023 = () => {
  return (
    <PageLayout>
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="box is-shadowless">
            <div className="is-block mb-5">
              <h1 className="title is-spaced">Consensus 2023</h1>
              <p className="subtitle">
                We're excited to showcase ourselves at the NEO booth during
                Consensus 2023, CoinDesk's annual conference. Explore our DApp
                at our booth and connect with our Discord community in the
                Consensus 2023 channel by saying hello. We have a special treat
                for our visitors: gift cards loaded with NEO private keys, which
                hold exclusive gifts for those who dive into our app and engage
                with our community.
              </p>
            </div>
            <div className="is-block mb-5">
              <Space>
                <img src="/events/consensus-discord-invite.png " />
                <h1 className="title">
                  Scan to join our discord <br /> say "Hi" to unlock a gift
                </h1>
              </Space>
            </div>
            <div className="content">
              <h5>Total Gift Value</h5>
              <p>$10,000</p>
              <h5>Gift Categories</h5>
              <p>NEPs, Locker Keys, Neo Boyz, Neo Boyz Key Ring</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Consensus2023;
