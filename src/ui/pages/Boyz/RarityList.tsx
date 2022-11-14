import React from "react";
import {BOYZ_RARITY, BOYZ_RARITY_WITH_PERCENT} from "./consts";

interface IRarityList {
  filter: object;
  setFilter: (key: string, value: string) => void;
  currentCategory: string;
  setCurrentCategory: (c: string) => void;
}
const rarities = Object.keys(BOYZ_RARITY_WITH_PERCENT);
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
              {BOYZ_RARITY_WITH_PERCENT[rarity].map((item, index) => {
                return (
                  <div key={`${item.value}${index}`} className="column is-4">
                    <span
                      onClick={() => setFilter(rarity, item.value)}
                      className={`tag is-clickable ${
                        filter[rarity].includes(item.value) ? "is-primary" : "is-light"
                      }`}
                    >
                      {item.value} {item.rarity}%
                    </span>
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
