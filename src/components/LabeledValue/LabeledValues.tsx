import { Text, VStack } from '@chakra-ui/react'

interface LabeledValueProps {
  label: string
  value: string | number
}

export const LabeledValue: React.FC<LabeledValueProps> = ({ label, value }) => (
  <VStack alignItems="flex-start" spacing={0}>
    <Text fontWeight="bold">{label}</Text>
    <Text>{value}</Text>
  </VStack>
)
