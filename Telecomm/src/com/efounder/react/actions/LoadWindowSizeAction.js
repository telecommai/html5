/*获取浏览器宽高action
author:xpf
 */
const LoadWindowSizeAction = (height, width) => {
	return {
		type: "loadWindowSize",
		height: height,
		width: width,
	}
};
export default LoadWindowSizeAction