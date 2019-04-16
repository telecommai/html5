/*将联系人列表持久化到store
author：xpf
*/
function CoinCountReducer(state = {
	integralTotal: 0,
	balance: 0,
	AllETHBalance: 0,
}, action) {
	switch (action.type) {
		case 'integralTotal':
			state.integralTotal = action.count;
			return {
				...state
			}
		case 'balance':
			state.balance = action.count;
			return {
				...state
			}
		case 'AllETHBalance':
			state.AllETHBalance = action.count;
		default:
			return state
	}
}
export default CoinCountReducer