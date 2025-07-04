import type { WagmiPortoConfig } from '@/src/lib/wallets/connectkit.config'
import { Button, Card, Flex, Heading } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import { useSetPermissions } from './useSetPermissions'

export const Home = () => {
  const { connect, connectors } = useConnect<WagmiPortoConfig>()
  console.log({ connect, connectors })
  const { grantPermissionToKey, keys, getNewKey } = useSetPermissions()

  return (
    <Flex
      alignItems="center"
      flexGrow={1}
      justifyContent="center"
    >
      <Card.Root
        maxWidth={'100%'}
        size={'lg'}
        width={'600px'}
      >
        <Card.Header
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={'row'}
        >
          <Heading>Porto DCA Savings</Heading>
        </Card.Header>
        <Card.Body
          gap={3}
          minHeight={'300px'}
        >
          <Button
            onClick={() => {
              getNewKey()
            }}
          >
            Get Key
          </Button>
          <Button
            onClick={() => {
              grantPermissionToKey(keys[0])
            }}
          >
            Set permissions
          </Button>
        </Card.Body>
      </Card.Root>
    </Flex>
  )
}

export default Home
