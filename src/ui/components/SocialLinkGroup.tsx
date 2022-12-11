import React from "react";
import { FaDiscord, FaMedium, FaTwitter, FaGithub } from "react-icons/fa";

const SocialLinkGroup = ({ inverted }: { inverted?: boolean }) => {
  return (
    <>
      <a
        target="_blank"
        href="https://twitter.com/N3_FTW_NETWORK"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
      >
        <FaTwitter />
      </a>
      <a
        target="_blank"
        href="https://github.com/ForTheWinn"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
      >
        <FaGithub />
      </a>
      <a
        target="_blank"
        href="https://discord.gg/A83mtQqsfP"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
      >
        <FaDiscord />
      </a>
      <a
        target="_blank"
        href="https://medium.com/@Forthewin_network"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
      >
        <FaMedium />
      </a>
    </>
  );
};

export default SocialLinkGroup;
