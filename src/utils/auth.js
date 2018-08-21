import Cookies from 'js-cookie'

const TokenKey = 'ticketId'
const CityKey = 'CITYID'
const DefaultCityId = '51010000' // 默认城市编码：51010000(成都)

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function initCity(store) {
  const cityId = Cookies.get(CityKey) || DefaultCityId
  setCity(store, cityId)
}

export function setCity(store, cityId) {
  Cookies.set(CityKey, cityId, { expires: 30 })
  store.commit('SET_CITYID', cityId)
}

export function getCity() {
  return Cookies.get(CityKey)
}
