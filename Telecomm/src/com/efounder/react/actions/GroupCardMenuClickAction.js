/*顶部菜单点击action
author:xpf
*/
const GroupCardMenuClickAction = (menukey) => {
	return {
		type: "GroupCardMenuClick",
		menukey: menukey,
	}
};
export default GroupCardMenuClickAction