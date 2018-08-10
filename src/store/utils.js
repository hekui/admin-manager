// 格式化类型
function formatType(data) {
  return data.map((item) => {
    const result = {
      value: item.id,
      label: item.name
    }
    if (item.childList.length > 0) {
      result.children = formatType(item.childList)
    }

    return result
  })
}

export default {
  formatType,
}
