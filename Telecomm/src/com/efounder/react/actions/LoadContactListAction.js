/*加载联系人动作
author：xpf
*/
const LoadContactListAction = (actiontype, list, result, count) => {
	return {
		type: actiontype,
		list: list,
		result: result,
		count: count,
	}
};
export default LoadContactListAction