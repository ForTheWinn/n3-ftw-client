import React from "react";
import SideNav from "react-simple-sidenav";
import { useApp } from "../../../../common/hooks/use-app";
import SidebarNav from "./SidebarNav";

const MobileMenuSlider = (props) => {
  const { sidebarStatus, toggleSidebar } = useApp();
  return (
    <SideNav
      style={{ top: "52px" }}
      // navStyle={{ width: "80%" }}
      showNav={sidebarStatus}
      onHideNav={toggleSidebar}
      children={<SidebarNav />}
    />
  );
};

export default MobileMenuSlider;
