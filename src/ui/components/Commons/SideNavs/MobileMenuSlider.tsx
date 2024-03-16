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
        rootStyle={{ top: "53px" }}
        placement={"left"}
        closable={false}
        onClose={toggleSidebar}
        open={sidebarStatus}
        styles={{
          header: { display: "none" },
          body: { padding: "0" },
        }}
      >
        <SidebarNav />
      </Drawer>
    </>
  );
};

export default MobileMenuSlider;
