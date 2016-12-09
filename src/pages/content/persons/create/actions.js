import { persistPerson } from '../../../../actions/person';

export const PERSON_PERSIST_ERROR = 'PERSON_CREATE/PERSON_PERSIST_ERROR';

// restProps contains: gender and fullName
export function submit ({ defaultLocale, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const person = {
        ...restProps,
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistPerson(person));
    } catch (error) {
      dispatch({ error, type: PERSON_PERSIST_ERROR });
    }
  };
}
