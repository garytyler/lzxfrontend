import type {AppLoadContext} from '@shopify/remix-oxygen';
import {getDataCollection} from '~/lib/db.server';
import type {DealerInterface} from '~/models/dealer';
import type {DealerView} from '~/views/dealer';

export async function getAllDealers(context: AppLoadContext) {
  const dealer_datas = (await getDataCollection(
    context,
    'Dealer',
  )) as DealerInterface[];

  const dealer_views: DealerView[] = [];

  dealer_datas.map((dealer_data) => {
    const dealer_view: DealerView = {
      name: dealer_data.name,
      url: dealer_data.url,
      country: dealer_data.country,
      city: dealer_data.city,
      logo: dealer_data.logo,
      state: dealer_data.state,
    };

    dealer_views.push(dealer_view);
  });

  return dealer_views;
}
