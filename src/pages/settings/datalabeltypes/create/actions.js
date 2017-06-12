import { persistDatalabeltype } from '../../../../actions/datalabeltype';
export const DATALABELTYPE_PERSIST_ERROR = 'DATALABELTYPE/DATALABELTYPE_PERSIST_ERROR';

export function submit ({ defaultLocale, name, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const datalabeltype = {
        ...restProps,
        name: { [defaultLocale]: name },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistDatalabeltype(datalabeltype));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPE_PERSIST_ERROR });
    }
  };
}

