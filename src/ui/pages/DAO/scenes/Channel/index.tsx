import React from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import ProposalList from "./ProposalList";
import Create from "./Create";
import { DAO_CHANNEL_PATH } from "../../../../../consts";
import ProposalView from "./View";
import Edit from "./Edit";

const DAOChannel = (props) => {
  const path = DAO_CHANNEL_PATH + "/:contractHash";

  return (
    <PageLayout>
      <Route exact={true} path={path} component={ProposalList} />
      <Route path={`${path}/create`} component={Create} />
      <Route path={`${path}/edit`} component={Edit} />
      <Route path={`${path}/proposal/:proposalNo`} component={ProposalView} />
    </PageLayout>
  );
};

export default DAOChannel;
