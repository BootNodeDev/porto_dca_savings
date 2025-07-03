import type { WagmiPortoConfig } from '@/src/lib/wallets/connectkit.config'
import { Card, Flex, Heading, Span } from '@chakra-ui/react'
import { useConnect } from 'wagmi'

export const Home = () => {
  const { connect, connectors } = useConnect<WagmiPortoConfig>()
  console.log({ connect, connectors })

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
          <Span marginLeft={'auto'}>👻</Span>
        </Card.Header>
        <Card.Body
          gap={3}
          minHeight={'300px'}
        ></Card.Body>
      </Card.Root>
    </Flex>
  )
}

export default Home
