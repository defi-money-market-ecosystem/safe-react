// @flow
import { Map, List, Set } from 'immutable'
import { type Match, matchPath } from 'react-router-dom'
import { createSelector, createStructuredSelector, type Selector } from 'reselect'
import { type GlobalState } from '~/store/index'
import { SAFE_PARAM_ADDRESS, SAFELIST_ADDRESS } from '~/routes/routes'
import { type Safe } from '~/routes/safe/store/models/safe'
import { type State as TransactionsState, TRANSACTIONS_REDUCER_ID } from '~/routes/safe/store/reducer/transactions'
import {
  type CancelState as CancelTransactionsState,
  CANCELLATION_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/cancellationTransactions'
import {
  type IncomingState as IncomingTransactionsState,
  INCOMING_TRANSACTIONS_REDUCER_ID,
} from '~/routes/safe/store/reducer/incomingTransactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Confirmation } from '~/routes/safe/store/models/confirmation'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'

export type RouterProps = {
  match: Match,
}

export type SafeProps = {
  safeAddress: string,
}

type TransactionProps = {
  transaction: Transaction,
}

const safesStateSelector = (state: GlobalState): Map<string, *> => state[SAFE_REDUCER_ID]

export const safesMapSelector = (state: GlobalState): Map<string, Safe> => state[SAFE_REDUCER_ID].get('safes')

export const safesListSelector: Selector<GlobalState, {}, List<Safe>> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): List<Safe> => safes.toList(),
)

export const safesCountSelector: Selector<GlobalState, {}, number> = createSelector(
  safesMapSelector,
  (safes: Map<string, Safe>): number => safes.size,
)

export const defaultSafeSelector: Selector<GlobalState, {}, string> = createSelector(
  safesStateSelector,
  (safeState: Map<string, *>): string => safeState.get('defaultSafe'),
)

const transactionsSelector = (state: GlobalState): TransactionsState => state[TRANSACTIONS_REDUCER_ID]

const cancellationTransactionsSelector = (state: GlobalState): CancelTransactionsState => state[
  CANCELLATION_TRANSACTIONS_REDUCER_ID
]

const incomingTransactionsSelector = (state: GlobalState): IncomingTransactionsState => state[
  INCOMING_TRANSACTIONS_REDUCER_ID
]

const oneTransactionSelector = (state: GlobalState, props: TransactionProps) => props.transaction

export const safeParamAddressSelector = (state: GlobalState, props: RouterProps) => props.match.params[SAFE_PARAM_ADDRESS] || ''

type TxSelectorType = Selector<GlobalState, RouterProps, List<Transaction>>

export const safeTransactionsSelector: TxSelectorType = createSelector(
  transactionsSelector,
  safeParamAddressSelector,
  (transactions: TransactionsState, address: string): List<Transaction> => {
    if (!transactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return transactions.get(address) || List([])
  },
)

export const addressBookQueryParamsSelector = (state: GlobalState): string => {
  const { location } = state.router
  let entryAddressToEditOrCreateNew = null
  if (location && location.query) {
    const { entryAddress } = location.query
    entryAddressToEditOrCreateNew = entryAddress
  }
  return entryAddressToEditOrCreateNew
}

export const safeCancellationTransactionsSelector: TxSelectorType = createSelector(
  cancellationTransactionsSelector,
  safeParamAddressSelector,
  (cancellationTransactions: TransactionsState, address: string): List<Transaction> => {
    if (!cancellationTransactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return cancellationTransactions.get(address) || List([])
  },
)

export const safeParamAddressFromStateSelector = (state: GlobalState): string => {
  const match = matchPath(
    state.router.location.pathname,
    { path: `${SAFELIST_ADDRESS}/:safeAddress` },
  )

  return match ? match.params.safeAddress : null
}

type IncomingTxSelectorType = Selector<GlobalState, RouterProps, List<IncomingTransaction>>

export const safeIncomingTransactionsSelector: IncomingTxSelectorType = createSelector(
  incomingTransactionsSelector,
  safeParamAddressSelector,
  (incomingTransactions: IncomingTransactionsState, address: string): List<IncomingTransaction> => {
    if (!incomingTransactions) {
      return List([])
    }

    if (!address) {
      return List([])
    }

    return incomingTransactions.get(address) || List([])
  },
)

export const confirmationsTransactionSelector: Selector<GlobalState, TransactionProps, number> = createSelector(
  oneTransactionSelector,
  (tx: Transaction) => {
    if (!tx) {
      return 0
    }

    const confirmations: List<Confirmation> = tx.get('confirmations')
    if (!confirmations) {
      return 0
    }

    return confirmations.filter((confirmation: Confirmation) => confirmation.get('type') === 'confirmation').count()
  },
)

export type SafeSelectorProps = Safe | typeof undefined

export const safeSelector: Selector<GlobalState, RouterProps, SafeSelectorProps> = createSelector(
  safesMapSelector,
  safeParamAddressFromStateSelector,
  (safes: Map<string, Safe>, address: string) => {
    if (!address) {
      return undefined
    }

    const safe = safes.get(address)

    return safe
  },
)

export const safeActiveTokensSelector: Selector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.activeTokens
  },
)

export const safeBlacklistedTokensSelector: Selector<GlobalState, RouterProps, List<string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.blacklistedTokens
  },
)

export const safeActiveTokensSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> => safes.get(safeAddress).get('activeTokens')

export const safeBlacklistedTokensSelectorBySafe = (safeAddress: string, safes: Map<string, Safe>): List<string> => safes.get(safeAddress).get('blacklistedTokens')

export const safeBalancesSelector: Selector<GlobalState, RouterProps, Map<string, string>> = createSelector(
  safeSelector,
  (safe: Safe) => {
    if (!safe) {
      return List()
    }

    return safe.balances
  },
)

export const getActiveTokensAddressesForAllSafes: Selector<GlobalState, any, Set<string>> = createSelector(
  safesListSelector,
  (safes: List<Safe>) => {
    const addresses = Set().withMutations((set) => {
      safes.forEach((safe: Safe) => {
        safe.activeTokens.forEach((tokenAddress) => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export const getBlacklistedTokensAddressesForAllSafes: Selector<GlobalState, any, Set<string>> = createSelector(
  safesListSelector,
  (safes: List<Safe>) => {
    const addresses = Set().withMutations((set) => {
      safes.forEach((safe: Safe) => {
        safe.blacklistedTokens.forEach((tokenAddress) => {
          set.add(tokenAddress)
        })
      })
    })

    return addresses
  },
)

export default createStructuredSelector<Object, *>({
  safe: safeSelector,
  tokens: safeActiveTokensSelector,
  blacklistedTokens: safeBlacklistedTokensSelector,
})
