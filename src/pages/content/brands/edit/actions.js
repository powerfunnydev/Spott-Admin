import { persistBrand, fetchBrand as dataFetchBrand,
      uploadProfileImage as dataUploadProfileImage,
      uploadLogoImage as dataUploadLogoImage } from '../../../../actions/brand';

export { deleteLogoImage, deleteProfileImage } from '../../../../actions/brand';
export const BRAND_FETCH_ENTRY_ERROR = 'BRANDS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'BRANDS_EDIT/CLOSE_POP_UP_MESSAGE';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistBrand;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadLogoImage = dataUploadLogoImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadBrand (brandId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBrand({ brandId }));
    } catch (error) {
      dispatch({ error, type: BRAND_FETCH_ENTRY_ERROR });
    }
  };
}
