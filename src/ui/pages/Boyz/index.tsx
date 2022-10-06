import React, { useEffect, useState } from "react";
import PageLayout from "../../components/PageLayout";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { useWallet } from "../../../packages/provider";
import { NFTContract } from "../../../packages/neo/contracts";
import { RUNE_PHASE_FILTER } from "../../../packages/neo/contracts/ftw/rune/consts";
import { handleError } from "../../../packages/neo/utils/errors";

const samples = ["1", "2", "3", "4", "5", "6", "7"];
const Boyz = () => {
  const [txid, setTxid] = useState("");
  const [filter, setFilter] = useState<string>(RUNE_PHASE_FILTER[0]);
  const [tokens, setTokens] = useState<any>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [propertiesModalActive, setPropertiesModalActive] = useState<string>();
  const { connectedWallet, network, addPendingTransaction } = useWallet();
  const onPropertiesModalActive = (tokenId: string) => {
    setPropertiesModalActive(tokenId);
  };
  const onFilterChange = (val: string) => setFilter(val);
  const onMint = async () => {
    if (connectedWallet) {
      try {
        const res = await new NFTContract(network).mint(connectedWallet);
        addPendingTransaction(res);
        setTxid(res);
      } catch (e: any) {
        toast.error(handleError(e));
      }
    } else {
      toast.error("Please connect wallet.");
    }
  };
  //
  // useEffect(() => {
  //   document.title =
  //     "FTW | NEO Boyz";
  //   async function fetchContractStatus() {
  //     setError("");
  //     setLoading(true);
  //     try {
  //       const items = await new RestAPI(network).getRunes(filter);
  //       // LEAVE TO SWITCH IN CASE DB ERROR
  //       // const res = await new NFTContract(network).getTokens();
  //       setTokens(items);
  //     } catch (e: any) {
  //       setError(e.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchContractStatus();
  // }, [network, filter]);
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false
	};
  return (
    <PageLayout>
      <div className="columns is-centered">
        <div className="column is-half">
          <div className="box is-paddingless">
	          <div className="p-5">
		          <h1 className="title is-4">NEO Boyz</h1>
		          <p className="subtitle is-6">250 unique collectible characters stored on the NEO blockchain</p>
	          </div>

	          <Slider {...settings}>
		          {samples.map((img) => {
			          return (
				          <div key={img}>
					          <img src={`/boyz/${img}.png`} width="100%" />
				          </div>
			          );
		          })}
	          </Slider>

	          <div className="p-5 has-text-centered mt-5">
		          <button className="button is-dark is-outlined">Minting at 2022.10.16 10 PM (UTC)</button>
	          </div>


	          <div className="p-5">

		          <div className="columns is-mobile">
			          <div className="column">
				          <div className="heading">Type</div>
				          <p>Collectible</p>
			          </div>
		          	<div className="column">
				          <div className="heading">Total supply</div>
				          <p>250</p>
		          	</div>
		          	<div className="column">
				          <div className="heading">Mint price</div>
				          <p>3,000 NEP</p>
		          	</div>
		          </div>

		          {/*<div className="level">*/}
			        {/*  <div className="level-left">*/}
				      {/*    <div className="level-item is-block">*/}
					    {/*      <div className="heading">Total supply</div>*/}
					    {/*      <p>0/250</p>*/}
				      {/*    </div>*/}
			        {/*  </div>*/}

			        {/*  <div className="level-right">*/}
				      {/*    <div className="level-item">*/}
					    {/*      <button className="button is-primary">Mint</button>*/}
				      {/*    </div>*/}
			        {/*  </div>*/}
		          {/*</div>*/}
	          </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Boyz;
