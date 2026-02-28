import { useQuery, UseQueryResult } from 'react-query';
import { fetch } from 'src/app/services';

import { Account } from '../types';

export const useAccount = <T extends Account = Account>(
  accountId: string,
): UseQueryResult<T, Error> => {
  return useQuery<T, Error>(
    ['accounts', accountId],
    async () => {
        console.log(URL, '<<<')
      const endpoint = new URL(`/api/accounts/${accountId}`, window.location.origin).href;      
      const resp = await fetch(endpoint);

      const body = (await resp.json()) as { account: Account } | Account;

      // Crypto vs Equity account differentiation
      if ((body as { account: Account })?.account) {
        return (body as { account: Account })?.account as T;
      }

      return body as T;
    },
    {
      enabled: !!accountId && accountId.length > 0,
    },
  );
};
