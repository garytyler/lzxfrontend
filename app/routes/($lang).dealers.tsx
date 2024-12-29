import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getAllDealers} from '~/controllers/get_all_dealers';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const dealerData = await getAllDealers(context);
  return dealerData;
}

export default function Patches() {
  const dealerData = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-auto justify-center">
        <article className="prose max-w-prose-wide px-8">
          {dealerData.map((dealer, it) => {
            return (
              <div
                key={`${dealer.name}-${dealer.city}-${dealer.state}-${dealer.country}`}
              >
                <div className="inline-block w-1/2 align-top">
                  <h2>{dealer.name}</h2>
                  <p>
                    {dealer.city}
                    {dealer.state ? ', ' + dealer.state : ''}
                    <br />
                    {dealer.country}
                    <br />
                    <a
                      href={'https://' + dealer.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {dealer.url}
                    </a>
                    <br />
                  </p>
                </div>
                <div className="inline-block w-1/2 align-top">
                  <a
                    href={'https://' + dealer.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="max-w-xs"
                      src={'/dealers/' + dealer.logo}
                      alt={`${dealer.name} logo`}
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </article>
      </div>
    </>
  );
}
