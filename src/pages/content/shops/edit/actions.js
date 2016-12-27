import { persistShop, fetchShop as dataFetchShop,
      uploadLogoImage as dataUploadLogoImage } from '../../../../actions/shop';

export { deleteLogoImage } from '../../../../actions/shop';
export const SHOP_FETCH_ENTRY_ERROR = 'SHOPS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'SHOPS_EDIT/CLOSE_POP_UP_MESSAGE';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistShop;
export const uploadLogoImage = dataUploadLogoImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadShop (shopId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchShop({ shopId }));
    } catch (error) {
      dispatch({ error, type: SHOP_FETCH_ENTRY_ERROR });
    }
  };
}
