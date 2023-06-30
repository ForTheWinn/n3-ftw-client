import React from "react";
import { useApp } from "../../../../common/hooks/use-app";
import SidebarNav from "./SidebarNav";
import { Drawer } from "antd";

const MobileMenuSlider = () => {
  const { sidebarStatus, toggleSidebar } = useApp();
  return (
    <>
      <Drawer
        title="Basic Drawer"
        headerStyle={{ display: "none" }}
        rootStyle={{ top: "53px" }}
        bodyStyle={{ padding: "0" }}
        placement={"left"}
        closable={false}
        onClose={toggleSidebar}
        open={sidebarStatus}
      >
        <SidebarNav />
      </Drawer>
    </>
  );
};

export default MobileMenuSlider;
