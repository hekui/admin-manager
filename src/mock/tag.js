const taglist = {
  curPage: 1,
  nextPage: 2,
  pageNum: 20, // 记录开始位置
  totalPage: 70,
  totalRecords: 694,
  previousPage: 1,
  hasPrevious: false,
  hasNext: true,
  sortName: '',
  sortType: 1, // 升序(asc, 1),降序(desc, 2)
  pageSize: 20,
  'list|10': [{
    'id|+1': 1,
    'name': '成都房帮帮',
    'sequenceNum|+1': 1,
    'hasGuide|1': [0, 1], // 0 是；1：否
    'typeName|1': ['', '1级-2级'],
    'labelStatus|1': [0, 1] // 0 激活；1：锁定
  }]
}

const querybyid = {
  'id': 1,
  'name': '成都房帮帮',
  'labelStatus': 0,
  'sequenceNum': 1,
  'hasGuide': 1,
  'cityId': '51010000',
  'typeName': 'typeName',
  'typeDictList': [{
    'id': 1,
    'child': [
      {
        'id': 3
      }
    ]
  }]
}

export default {
  list: {
    code: 0,
    msg: 'success',
    data: taglist
  },
  querybyid: {
    code: 0,
    msg: 'success',
    data: querybyid
  },
  save: {
    code: 0,
    msg: 'success'
  },
  status: {
    code: 0,
    msg: 'success'
  }
}
