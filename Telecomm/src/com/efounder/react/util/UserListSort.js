/*联系人排序工具类
author：xpf
*/
import ChinesePY from "./ChinesePY.js"

var UserListSort = function() {}
var addlistSortPrototype = UserListSort.prototype

addlistSortPrototype.listSort = function(testlist) {
  var Pinyin = new ChinesePY();
  var addlist = [];
  //保险起见新建一个原数组，逐渐剔除匹配成功数据
  var orglist = [];
  for (var value of testlist) {
    orglist.push(value);
  }
  var zmlist = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  for (var i = 0; i < zmlist.length; i++) {
    var listtmp = [{
      "ZMNO": zmlist[i].toUpperCase()
    }]
    for (var j = 0; j < testlist.length; j++) {
      if (zmlist[i] == Pinyin.GetJP(testlist[j].nickName.replace(/\d+/g, '')).substring(0, 1)) {
        listtmp.push(testlist[j])
        //新建的原数组中，删除已经添加的数据
        orglist = this.deleteEle(orglist, testlist[j])
      }
    }
    if (listtmp.length != 1) {
      addlist.push(...listtmp);
    }
  }
  addlist.reverse(); //反转一下用于把未匹配的数据添加到头部
  addlist.push(...orglist) //添加剩余未匹配的数据
  addlist.reverse(); //反转，未匹配的数据显示在头部
  return addlist;

}
//删除已经匹配的数据
addlistSortPrototype.deleteEle = function(list, ele) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].userId == ele.userId) {
      list.splice(i, 1);
      break;
    }
  }
  return list;
}
export default UserListSort