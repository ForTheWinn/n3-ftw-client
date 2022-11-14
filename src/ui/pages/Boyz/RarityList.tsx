import React from "react";
import { BOYZ_RARITY } from "./consts";

interface IRarityList {
  filter: object;
  setFilter: (key: string, value: string) => void;
  currentCategory: string;
  setCurrentCategory: (c: string) => void;
}
const rarities = Object.keys(BOYZ_RARITY);
const RarityList = ({
  filter,
  setFilter,
  currentCategory,
  setCurrentCategory,
}: IRarityList) => {
  return (
    <div>
      <div className="tabs">
        <ul>
          {rarities.map((category) => {
            return (
              <li
                key={category}
                className={category === currentCategory ? "is-active" : ""}
              >
                <a
                  className="is-capitalized"
                  onClick={() => setCurrentCategory(category)}
                >
                  {category}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      {rarities.map((rarity) => {
        return (
          <div
            key={`${rarity}-list`}
            className={rarity === currentCategory ? "" : "is-hidden"}
          >
            <div className="columns is-multiline">
              {BOYZ_RARITY[rarity].map((i, index) => {
                return (
                  <div key={`${i}${index}`} className="column is-4">
                    <span
                      onClick={() => setFilter(rarity, i)}
                      className={`tag is-clickable ${
                        filter[rarity].includes(i) ? "is-info" : "is-light"
                      }`}
                    >
                      {i}
                    </span>
                    {/*<label className="checkbox">*/}
                    {/*  <input*/}
                    {/*    onClick={() => setFilter(rarity, i)}*/}
                    {/*    type="checkbox"*/}
                    {/*    checked={filter[rarity].includes(i)}*/}
                    {/*  />{" "}*/}
                    {/*  {i}*/}
                    {/*</label>*/}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RarityList;
