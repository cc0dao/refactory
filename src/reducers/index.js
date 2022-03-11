import user from './user.reducer'
import modals from './modals.reducer'
import global from './global.reducer'
import garment from './garment.reducer'
import designer from './designer.reducer'
import designerPage from './designer.page.reducer'
import garmentPage from './garment.page.reducer'
import tokenURIInfo from './token.uri.info.reducer'

export default {
  user: user.reducer,
  modals: modals.reducer,
  global: global.reducer,
  garment: garment.reducer,
  designer: designer.reducer,
  designerPage: designerPage.reducer,
  garmentPage: garmentPage.reducer,
  tokenURIInfo: tokenURIInfo.reducer
}
