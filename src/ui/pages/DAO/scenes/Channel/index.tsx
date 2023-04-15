import React from "react";
import PageLayout from "../../../../components/Commons/PageLayout";
import { Route } from "react-router-dom";
import ProposalList from "./ProposalList";
import Create from "./Create";
import ProposalView from "./View";
import Edit from "./Edit";
import { NEO_ROUTES } from "../../../../../consts";

const DAOChannel = (props) => {
  const path = NEO_ROUTES.DAO_CHANNEL_PATH + "/:contractHash";

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
