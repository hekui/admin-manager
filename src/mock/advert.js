const advertlist = {
  totalPage: 70,
  curPage: 1,
  pageSize: 20,
  totalRecords: 694,
  'list|10': [{
    'id|+1': 1,
    adName: '成都房帮帮',
    adPicture: 'http://localhost:9527/static/img/logo.69c2347.jpg',
    'adStatus|1': [-1, 0, 1], // -1：下线   0：待上线  1：上线
    deliveryTime: '2018-8-12 13:33:00',
    onlineTime: [new Date('2018-7-13 13:33:00'), new Date('2018-8-12 13:33:00')]
  }]
}

export default {
  list: {
    code: 0,
    msg: 'success',
    data: advertlist
  },
  save: {
    code: 0,
    msg: 'success'
  }
}
