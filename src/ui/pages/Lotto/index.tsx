import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { LOTTO_PATH } from "../../../consts";
import PageLayout from "../../components/Commons/PageLayout";
import Main from "./Main";

const Lotto = () => {
  useEffect(() => {
    document.title = "FTW Sweepstake";
  }, []);
  return (
    <div>
      <PageLayout>
        <div className="columns is-centered">
          <div className="column is-half">
            <Route exact={true} path={LOTTO_PATH} component={Main} />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Lotto;
