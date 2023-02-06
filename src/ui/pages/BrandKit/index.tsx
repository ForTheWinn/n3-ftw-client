import React, { useEffect } from "react";
import PageLayout from "../../components/Commons/PageLayout";

const BrandKit = (props) => {
  useEffect(() => {
    document.title = "FTW's brand kit";
  }, []);
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-8">
          <div className="box is-shadowless">
            <h1 className="title">Brand kit</h1>
            <p className="subtitle">
              Forthewin Network’s branding is a graphical representation of
              FTW’s vision and identity.
            </p>
            <hr />

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The Logo</h5>
                  <p>
                    The FTW symbol on its own shall be used in most
                    circumstances.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure className="image">
                      <img src="/kit/FTW_Logo_Black.png" alt="FTW Logo Black" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FTW_Logo_Black.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FTW_Logo_Black.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
                <div className="card mb-5">
                  <div className="card-image has-background-black">
                    <figure className="image">
                      <img src="/kit/FTW_Logo_White.png" alt="FTW Logo White" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FTW_Logo_White.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FTW_Logo_White.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
                <div className="card mb-5">
                  <div className="card-image">
                    <figure className="image">
                      <img
                        src="/kit/FORTHEWIN_Black.svg"
                        alt="FORTHEWIN logo Black"
                      />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FORTHEWIN_Black.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FORTHEWIN_Black.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
                <div className="card mb-5">
                  <div className="card-image has-background-black">
                    <figure className="image">
                      <img
                        src="/kit/FORTHEWIN_White.png"
                        alt="FORTHEWIN logo White"
                      />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FORTHEWIN_White.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FORTHEWIN_White.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The NEP Token</h5>
                  <p>
                    "NEP" represents the governance and platform token on
                    Forthewin Network.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure
                      className="image is-128x128"
                      style={{ margin: "auto" }}
                    >
                      <img src="/kit/NEP_Token.png" alt="NEP Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/NEP_Token.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/NEP_Token.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5> The FTW LP (Liquidity Pool) Logo</h5>
                  <p>
                    “FTW LP” represents the FTW DeFi Liquidity Pools on
                    Forthewin Network.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure
                      className="image is-128x128"
                      style={{ margin: "auto" }}
                    >
                      <img src="/kit/FTW_LP.png" alt="FTW LP Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FTW_LP.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FTW_LP.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The FTW Locker Key Logo</h5>
                  <p>
                    "FTW Locker Key" represents the FTW Locker feature on
                    Forthewin Network.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure
                      className="image is-128x128"
                      style={{ margin: "auto" }}
                    >
                      <img src="/kit/FTW_Key.png" alt="FTW Key Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FTW_Key.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FTW_Key.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The Rune Logo</h5>
                  <p>
                    The FTW symbol is also the Rune logo and should be used to
                    represent the Rune NFT Collection.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure className="image" style={{ margin: "auto" }}>
                      <img src="/kit/FTW_Logo_Black.png" alt="FTW Rune Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/FTW_Logo_Black.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/FTW_Logo_Black.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The Fusion Logo</h5>
                  <p>
                    The FTW logo inside the TOTHEMOON UNIVERSE logo represents
                    the Fusion NFT Collection and partnership between the two
                    Neo based projects.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure
                      className="image is-128x128"
                      style={{ margin: "auto" }}
                    >
                      <img src="/kit/Fusion_Logo.png" alt="FTW Fusion Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/Fusion_Logo.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                    <a
                      href="/kit/Fusion_Logo.svg"
                      className="card-footer-item"
                      download
                    >
                      SVG
                    </a>
                  </footer>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column is-6">
                <div className="content">
                  <h5>The Neo Boyz Logo</h5>
                  <p>
                    The following Neo Boyz NFT is used to represent the Neo Boyz
                    NFT Collection.
                  </p>
                </div>
              </div>
              <div className="column is-6">
                <div className="card mb-5">
                  <div className="card-image">
                    <figure
                      className="image is-128x128"
                      style={{ margin: "auto" }}
                    >
                      <img src="/kit/Neo_Boyz_NFT.png" alt="Neo Boyz Logo" />
                    </figure>
                  </div>
                  <footer className="card-footer">
                    <a
                      href="/kit/Neo_Boyz_NFT.png"
                      className="card-footer-item"
                      download
                    >
                      PNG
                    </a>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BrandKit;
