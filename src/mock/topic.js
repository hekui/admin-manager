const topiclist = {
  curPage: 8,
  previousPage: 4,
  nextPage: 9,
  pageNum: 153,
  totalPage: 8,
  totalRecords: 147,
  pageSize: 10,
  hasPrevious: false,
  hasNext: false,
  sortName: 'filed-name',
  sortType: 2,
  'list|10': [{
    'id|+1': 1,
    'name|2-7': '成都房帮帮',
    'topicStatus|0-2': 0,
    'labels|3': [{
      'id|+1': 1,
      'name|2-3': '太古里',
    }],
    'sort|0-99': 0,
    createTime: '2016-05-03',
    effectTime: '2018-08-08 08:08',
    expireTime: '2018-08-08 08:08'
  }]
}

const articlelist = {
  curPage: 1,
  hasNext: true,
  hasPrevious: false,
  nextPage: 2,
  pageSize: 20,
  qualification: 'EQ',
  sortType: 'ASC',
  totalPage: 70,
  totalRecords: 694,
  'list|10': [{
    'id|+1': 1,
    wechatName: '成都房帮帮',
    city: '成都',
    title: '买房就维权，成都精装房是有多垃圾？asdadasda',
    createTime: '2016-05-03',
    type: '房地产-土拍',
    readNum: 1232322,
    contentUrl: 'http://www.baidu.com/'
  }]
}

const taglist = {
  'list|20': [{
    'id|+1': 1,
    'name|2-5': '大宝',
    'labelStatus|0-1': 0
  }]
}

const topicinfo = {
  'id|+1': 1,
  'name|2-7': '成都房帮帮',
  'subtitle|2-7': '成都房帮帮',
  'template': 0,
  'labels|4': [1],
  headUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534473554&di=b220b5620157bebd6d2adf3f47a93c28&imgtype=jpg&er=1&src=http%3A%2F%2Fimg2.everychina.com%2Fimg%2Fab%2Fff%2Fce987d754b9898c8a4cd09c1f269-600x600c0-0dd4%2F138_inch_pin_header_customized_volume_requirements_are_welcome.jpg',
  recommend: 0,
  effectTime: '2018-08-08 08:08',
  expireTime: '2018-08-08 08:08',
  destinationUrl: 'https://image.baidu.com/'
}

export default {
  topiclist: {
    code: 0,
    msg: 'success',
    data: topiclist
  },
  articlelist: {
    code: 0,
    msg: 'success',
    data: articlelist
  },
  topicinfo: {
    code: 0,
    msg: 'success',
    data: topicinfo
  },
  taglist: {
    code: 0,
    msg: 'success',
    data: taglist
  }
}
