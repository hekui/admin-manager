export default {
  list: {
    code: 0,
    msg: 'success',
    data: [{
      'id': '154',
      'name': '类型一',
      'code': '1001',
      'parentId': '1',
      'typeStatus': 0, // 0: 激活, 1：锁定
      'remark': '备注',
      'childList': [{
        'id': '18184',
        'name': '类型一子一',
        'code': '1001001',
        'parentId': '154',
        'typeStatus': 0,
        'remark': '备注',
        'childList': [{
          'id': '1818418541',
          'name': '类型一子一子十六',
          'code': '1001001016',
          'parentId': '18184',
          'typeStatus': 1,
          'remark': '备注',
          'childList': []
        }]
      }]
    }]
  },
  delete: {
    code: 0,
    msg: 'success'
  },
  save: {
    code: 0,
    msg: 'success'
  },
  status: {
    code: 0,
    msg: 'success'
  },
  querybyid: {
    code: 0,
    msg: 'success',
    data: {}
  }
}
