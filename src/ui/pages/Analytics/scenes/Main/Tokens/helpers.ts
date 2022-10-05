export const priorityList = ["bNEO", "GAS",  "NEP","TTM",];

export const sorter = (a, b) => {
	if(priorityList.includes(a)){
		return -1;
	};
	if(priorityList.includes(b)){
		return 1;
	};
	return 0;
};
