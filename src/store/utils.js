// 格式化类型
function formatType(data) {
  return data.map((item) => {
    const result = {
      value: item.id,
      label: item.name
    }
    if (Object.prototype.toString.call(item.childList) === '[object Array]' && item.childList.length > 0) {
      result.children = formatType(item.childList)
    }

    return result
  })
}
// 格式化所属分类
function formatClass(data) {
  const result = []
  for (var item in data) {
    result.push({
      value: item,
      label: data[item]
    })
  }
  return result
}

export default {
  formatType,
  formatClass,
}
