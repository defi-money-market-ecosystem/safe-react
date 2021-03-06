// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import { screenSm, connected as connectedBg, sm } from '~/theme/variables'
import Identicon from '~/components/Identicon'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import CircleDot from '~/components/Header/components/CircleDot'

type Props = {
  provider: string,
  network: string,
  classes: Object,
  userAddress: string,
  connected: boolean,
}

const styles = () => ({
  network: {
    fontFamily: 'Averta, sans-serif',
  },
  identicon: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  dot: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    color: connectedBg,
    display: 'none',
    height: '15px',
    position: 'relative',
    right: '10px',
    top: '12px',
    width: '15px',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'left',
    paddingRight: sm,
  },
  address: {
    letterSpacing: '-0.5px',
  },
})

const ProviderInfo = ({
  provider, network, userAddress, connected, classes,
}: Props) => {
  const providerText = `${provider} [${network}]`
  const cutAddress = connected ? shortVersionOf(userAddress, 4) : 'Connection Error'
  const color = connected ? 'primary' : 'warning'
  const identiconAddress = userAddress || 'random'

  return (
    <>
      {connected && (
        <>
          <Identicon className={classes.identicon} address={identiconAddress} diameter={30} />
          <Dot className={classes.dot} />
        </>
      )}
      {!connected && <CircleDot keySize={14} circleSize={35} dotSize={16} dotTop={24} dotRight={11} mode="warning" />}
      <Col start="sm" layout="column" className={classes.account}>
        <Paragraph size="xs" transform="capitalize" className={classes.network} noMargin weight="bolder">
          {providerText}
        </Paragraph>
        <Paragraph size="xs" className={classes.address} noMargin color={color}>
          {cutAddress}
        </Paragraph>
      </Col>
    </>
  )
}

export default withStyles(styles)(ProviderInfo)
