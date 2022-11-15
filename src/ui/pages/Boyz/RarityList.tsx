import React, { useState } from "react";
import { BOYZ_RARITY_WITH_PERCENT } from "./consts";

interface IRarityList {
  filter: object;
  setFilter: (newFilter: any) => void;
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
  const [newFilter, setNewFilter] = useState(filter);

  const onFilterChange = (key: string, val: string) => {
    let arr = [...newFilter[key]];
    if (arr.includes(val)) {
      arr = arr.filter((item) => item !== val);
    } else {
      arr.push(val);
    }
    // newFilter[key] = arr;
    setNewFilter({
      ...newFilter,
      [key]: arr,
    });
  };
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
                      onClick={() => onFilterChange(rarity, item.value)}
                      className={`tag is-clickable ${
                        newFilter[rarity].includes(item.value)
                          ? "is-primary"
                          : "is-light"
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
      <hr />
      <button onClick={() => setFilter(newFilter)} className="button is-black">
        Browse
      </button>
    </div>
  );
};

export default RarityList;
