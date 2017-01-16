import { createStructuredSelector } from 'reselect';
import { currenciesSelector } from '../../../../../../selectors/global';
import {
  productsEntitiesSelector,
  imageHasSuggestedProductsRelationsSelector
} from '../../../../../../selectors/data';

export default createStructuredSelector({
  currencies: currenciesSelector,
  products: productsEntitiesSelector,
  imageHasSuggestedProducts: imageHasSuggestedProductsRelationsSelector
});
