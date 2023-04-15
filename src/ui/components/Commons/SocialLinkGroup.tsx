import React from "react";
import { FaDiscord, FaMedium, FaTwitter, FaGithub } from "react-icons/fa";

interface ISocialLinkGroupProps {
  inverted?: boolean;
}
const SocialLinkGroup = ({ inverted }: ISocialLinkGroupProps) => {
  return (
    <>
      <a
        target="_blank"
        href="https://twitter.com/N3_FTW_NETWORK"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
        rel="noreferrer"
      >
        <FaTwitter />
      </a>
      <a
        target="_blank"
        href="https://github.com/ForTheWinn"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
        rel="noreferrer"
      >
        <FaGithub />
      </a>
      <a
        target="_blank"
        href="https://discord.gg/A83mtQqsfP"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
        rel="noreferrer"
      >
        <FaDiscord />
      </a>
      <a
        target="_blank"
        href="https://medium.com/@Forthewin_network"
        className={`button is-small ${inverted ? "is-black" : "is-white"}`}
        rel="noreferrer"
      >
        <FaMedium />
      </a>
    </>
  );
};

export default SocialLinkGroup;
