// @flow
import type { RecordOf } from 'immutable'

export type AddressBookEntry = {
  address: string;
  name: string;
  isOwner: boolean;
}

export type AddressBookProps = {
  addressBook: Map<string, AddressBookEntry>
}

export type AddressBook = RecordOf<AddressBookProps>
