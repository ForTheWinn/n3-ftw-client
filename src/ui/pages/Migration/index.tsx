import React, { useEffect, useRef, useState } from "react";
// tslint:disable-next-line:no-submodule-imports
import PageLayout from "../../components/Commons/PageLayout";
// import * as THREE from "three";
// <!--        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>-->
const Migration = (props) => {
  // const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  // useEffect(() => {
  //   document.title = "FTW NEP5 Migration";
  //   if (!vantaEffect) {
  //     setVantaEffect(
  //       DOTS({
  //         el: myRef.current,
  //         mouseControls: true,
  //         touchControls: true,
  //         gyroControls: false,
  //         minHeight: 200.0,
  //         minWidth: 200.0,
  //         backgroundColor: 0x80822,
  //         size: 2.8,
  //       })
  //     );
  //   }
  //   return () => {
  //     if (vantaEffect) {
  //       // @ts-ignore
  //       vantaEffect.destroy();
  //     }
  //   };
  // }, [vantaEffect]);
  return (
    <div>
      <section className="hero is-white">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-flex" style={{ alignItems: "center" }}>
                <div>
                  <h1 className="title">Forthewin is back</h1>
                  <p className="subtitle">
                    Migrate your Neo-legacy FTX to the new <span>N3 FTW</span>
                  </p>
                  <a
                    target="_blank"
                    href="https://nepmigration.com/"
                    className="button is-primary"
                  >
                    Go to Migrate
                  </a>
                </div>
              </div>
              <div className="column is-hidden-touch">
                <div
                  className="block"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "300px",
                  }}
                >
                  <video style={{ width: "400px" }} autoPlay loop>
                    <source src={"/assets/migration.mp4"} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PageLayout>
        <div className="columns halo" ref={myRef}>
          <div className="column">
            <div className="has-background-white">
              <div className="box content">
                <h3>Neo-legacy</h3>
                <h6>Symbol</h6>
                <p>FTX</p>
                <h6>Contract hash</h6>
                <p>0xaac66f9779ca67d819d05492805d251dab02fc7b</p>
                <h6>Total supply</h6>
                <p>500,000,000</p>
                <h6>Browser</h6>
                <p>
                  <a
                    className="has-text-dark"
                    target="_blank"
                    href="https://neotracker.io/asset/aac66f9779ca67d819d05492805d251dab02fc7b"
                  >
                    Open
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="has-background-white">
              <div className="box content">
                <h3>N3</h3>
                <h6>Symbol</h6>
                <p>FTW</p>
                <h6>Contract hash</h6>
                <p>
                  <a
                    target="_blank"
                    className="has-text-dark"
                    href="https://explorer.onegate.space/contractinfo/0x9f8b20c31bb9e45003f2d9f316d2caf1dcd1bf20"
                  >
                    0x9f8b20c31bb9e45003f2d9f316d2caf1dcd1bf20
                  </a>
                </p>
                <h6>Total supply</h6>
                <p>500,000,000</p>
                <h6>Browser</h6>
                <p>
                  <a
                    className="has-text-dark"
                    target="_blank"
                    href="https://explorer.onegate.space/NEP17tokeninfo/0x9f8b20c31bb9e45003f2d9f316d2caf1dcd1bf20"
                  >
                    Open
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default Migration;
