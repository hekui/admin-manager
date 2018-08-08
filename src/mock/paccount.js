import Mock from 'mockjs'
var Random = Mock.Random

const data = {
  curPage: 1,
  hasNext: true,
  hasPrevious: false,
  nextPage: 2,
  pageSize: 20,
  qualification: 'EQ',
  sortType: 'ASC',
  totalPage: 70,
  totalRecords: 694,
  'list|20': [{
    'id|+1': 1,
    pimg: '图标',
    pname: Random.cname(),
    penName: 'fangguancha',
    cityName: Random.city(),
    status: 0,
    category: [1, 2],
    type: '分类',
    'add-date': Random.date(),
    'last-date': Random.date(),
    count: 200
  }]
}

const article = {
  curPage: 1,
  hasNext: true,
  hasPrevious: false,
  nextPage: 2,
  pageSize: 20,
  qualification: 'EQ',
  sortType: 'ASC',
  totalPage: 3,
  totalRecords: 50,
  'list|20': [{
    'id|+1': 1,
    aname: Random.csentence(5, 30),
    cityName: Random.city(),
    status: 1,
    'status|1': [
      0,
      1,
      2
    ],
    category: [1, 2],
    'type|1': [
      '房地产-土拍',
      '房地产-商业',
      '房地产-写字楼'
    ],
    'readNumber|1-10000': 100,
    'praise|1-1000': 100,
    date: Random.now('yyyy-MM-dd HH:mm'),
    count: 200,
    content: Random.cparagraph()
  }]
}

export default {
  index: {
    code: 0,
    msg: 'success',
    data
  },
  article: {
    code: 0,
    msg: 'success',
    data: article
  }
}
