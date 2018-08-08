const taglist = {
  totalPage: 70,
  curPage: 1,
  pageSize: 20,
  totalRecords: 694,
  'list|10': [{
    'id|+1': 1,
    tagName: '成都房帮帮',
    'order|+1': 1,
    'guide|1': [0, 1], // 0：否 1：是
    'tagType|1': [[], [1, 3], [1, 4], [2, 5], [2, 6]],
    'status|1': [0, 1], // 0：锁定 1：激活
    deliveryTime: '2018-8-12 13:33:00',
    onlineTime: [new Date('2018-7-13 13:33:00'), new Date('2018-8-12 13:33:00')]
  }]
}

export default {
  list: {
    code: 0,
    msg: 'success',
    data: taglist
  },
  save: {
    code: 0,
    msg: 'success'
  },
  offline: {
    code: 0,
    msg: 'success'
  }
}
