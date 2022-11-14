import {INetworkType, Network} from "../../../network";

import {IRuneMeta} from "../rune/interfaces";
import {parseProperties} from "../rune/helpers";
import {BOYZ_SCRIPT_HASH} from "./consts";
import {IBoy} from "./interface";
import { parseMapValue } from "../../../utils";

export class BoyzContract {
	network: INetworkType;
	contractHash: string;

	constructor(networkType: INetworkType) {
		this.network = networkType;
		this.contractHash = BOYZ_SCRIPT_HASH[networkType];
	}

	getProperties = async (tokenId: string): Promise<IBoy | null> => {
		const script = {
			scriptHash: this.contractHash,
			operation: "properties",
			args: [
				{
					type: "String",
					value: tokenId,
				},
			],
		};
		const res = await Network.read(this.network, [script]);
		if (res.state === "FAULT") {
			throw new Error("Failed");
		}
		return parseMapValue(res.stack[0] as any);
	};
}
