import { persistDatalabel } from '../../../../actions/datalabel';
export const DATALABEL_PERSIST_ERROR = 'DATALABEL/DATALABELTYPE_PERSIST_ERROR';

export function submit ({ defaultLocale, name, type, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const datalabel = {
        ...restProps,
        name: { [defaultLocale]: name },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ],
        type
      };
      return await dispatch(persistDatalabel(datalabel));
    } catch (error) {
      dispatch({ error, type: DATALABEL_PERSIST_ERROR });
    }
  };
}

