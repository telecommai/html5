/*顶部菜单点击action
author:xpf
*/
const MainMenuClickAction = (menukey) => {
	return {
		type: "MainMenuClick",
		menukey: menukey,
	}
};
export default MainMenuClickAction