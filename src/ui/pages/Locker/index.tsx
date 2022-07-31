import cReact, {useEffect} from "react";
import {Route} from "react-router-dom";
import {
	DAO_PAGE_ROUTE,
	LOCKER_CONTRACT_PATH,
	LOCKER_CREATE_PATH,
	LOCKER_PATH,
	LOCKER_SEARCH_PATH,
	LOCKER_USER_PATH
} from "../../../consts";
import LockerMain from "./Main";
import Create from "./Create";
import PageLayout from "../../components/PageLayout";
import LockersByContract from "./LockersByContract";
import LockerKeys from "./LockerKeys";
import LockerSearch from "./Search";

const Locker = () => {
	useEffect(() => {
		document.title = "FTW Locker";
	}, []);

	return (
		<PageLayout>
			<Route exact={true} path={LOCKER_PATH} component={LockerMain} />
			<Route path={`${LOCKER_CONTRACT_PATH}/:contractHash`} component={LockersByContract} />
			<Route path={LOCKER_USER_PATH} component={LockerKeys} />
			<Route path={`${LOCKER_SEARCH_PATH}`} component={LockerSearch} />
			<Route
				path={LOCKER_CREATE_PATH}
				component={Create}
			/>
		</PageLayout>
	);
};

export default Locker;
