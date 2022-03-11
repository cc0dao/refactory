import BaseActions from '@actions/base-actions'
import api from '@services/api/espa/api.service'
import { mapImmuatableDataById } from '@helpers/map.helpers'
import { getUser, getAuthToken } from '@helpers/user.helpers'
import reducer from '../reducers/designer.reducer'

class DesignerActions extends BaseActions {

  mapData(designers) {
    return async (dispatch, getState) => {
      const state = getState()
      let designersById = state.designer.get('designersById')
      designersById = mapImmuatableDataById(designers, designersById)
      dispatch(this.setValue('designersById', designersById))
    }
  }

  setCurrentDesignerInfo(designer) {
    return async (dispatch) => {
      dispatch(this.setValue('designerInfo', designer))
    }
  }

  updateProfile(designer) {
    return async (dispatch) => {
      try {
        const user = getUser()
        const newDesigner = {
          ...designer,
          wallet: user.wallet,
          randomString: user.randomString
        }

        dispatch(this.setValue('isLoading', true))
        const data = await api.registerDesigner(newDesigner)
        if (data) {
          dispatch(this.setValue('designerInfo', designer))
          toast('Designer Info is updated')
        } else {
        }
      } catch (e) {}
      dispatch(this.setValue('isLoading', false))
    }
  }

  uploadAvatar(file) {
    return async (dispatch, getState) => {
      const state = getState()
      try {
        dispatch(this.setValue('isLoading', true))
        let url = await api.getPresignedUrl()
        if (url) {
          const result = await api.uploadImageToS3(url, file)
          if (result) {
            const designer = Object.fromEntries(state.designer
              .get('designerInfo'))
            const queryIndex = url.indexOf('?')
            if (queryIndex >= 0) {
              url = url.slice(0, queryIndex)
            }
            designer.image_url = url

            dispatch(this.updateProfile(designer))
          }
        }
      } catch (e) {}
      dispatch(this.setValue('isLoading', false))
    }
  }

  setIsloading(loading) {
    return async (dispatch) => {
      dispatch(this.setValue('isLoading', loading))
    }
  }
}

export default new DesignerActions(reducer)
