import React from "react";
import { FaListAlt } from "react-icons/fa";

interface IPoolListButtonProps {
  onClick: (status: boolean) => void;
}
const PoolListButton = ({ onClick }: IPoolListButtonProps) => {
  return (
    <button onClick={() => onClick(true)} className="button is-small is-white">
      <span className="icon">
        <FaListAlt />
      </span>
      <span className="ml-1 is-hidden-mobile">Pools</span>
    </button>
  );
};

export default PoolListButton;
