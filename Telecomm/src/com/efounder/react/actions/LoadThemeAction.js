/*主题颜色加载
author：xpf
*/
const LoadThemeAction = (theme) => {
	return {
		type: "loadtheme",
		theme: theme,
	}
};
export default LoadThemeAction