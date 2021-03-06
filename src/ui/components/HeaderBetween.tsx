import React from "react";
import { Link } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
interface IHeaderBetweenProps {
  path: string | object;
  title: string;
  isLoading?: boolean;
}
const HeaderBetween = (props: IHeaderBetweenProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ width: "50px" }}>
        <Link className="button is-white is-small" to={props.path}>
          <span className="icon">
            <FaAngleLeft />
          </span>
          <span>Main</span>
        </Link>
      </div>
	    <h1 className="title  is-5 is-marginless">{props.title}</h1>
      <div className="is-relative" style={{ width: "50px" }}>
        {props.isLoading && (
          <div
            className="button is-white is-loading"
            style={{ position: "absolute", right: 0 }}
          />
        )}
      </div>
    </div>
  );
};

export default HeaderBetween;
