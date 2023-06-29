import React from "react";

const SmithInfo = (props) => {
  return (
    <div>
      <h5 className="title is-5">FTW Smith</h5>
      <div className="content">
        <p>Deploy your token smart contract in a few clicks.</p>
      </div>

      <div className="content">
        <li>
          <a
            target="_blank"
            href={"https://docs.forthewin.network/smith"}
            rel="noreferrer"
          >
            Tutorial for token contract
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href={
              "https://medium.com/@Forthewin_network/diy-nft-smart-contract-on-neo-without-codes-82957811f5ff"
            }
            rel="noreferrer"
          >
            Tutorial for NFT contract
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href={"https://www.youtube.com/watch?v=yqZJE7NXu5o"}
            rel="noreferrer"
          >
            Tutorials on Youtube
          </a>
        </li>
      </div>
    </div>
  );
};

export default SmithInfo;
