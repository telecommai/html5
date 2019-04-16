/*加载一些币数量的action
author：xpf
*/
const LoadCoinCountAction = (actiontype,count) => {
	return {
		type: actiontype,
		count: count,
	}
};
export default LoadCoinCountAction