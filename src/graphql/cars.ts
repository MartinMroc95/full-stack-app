import { gql } from '@apollo/client'
import type { Prisma } from '@prisma/client'

export type UpdateCarInput = Prisma.CarUpdateInput

export const GetUserCarsQuery = gql`
  query allCarsQuery($first: Int, $after: String) {
    cars(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          brand
          model
          year
          mileage
          fuelType
          enginePower
          price
          description
        }
      }
    }
  }
`

export const CreateCarMutation = gql`
  mutation addCar(
    $brand: String!
    $model: String!
    $year: Int!
    $mileage: Int!
    $fuelType: String!
    $enginePower: Int!
    $price: Int!
    $description: String!
  ) {
    addCar(
      brand: $brand
      model: $model
      year: $year
      mileage: $mileage
      fuelType: $fuelType
      enginePower: $enginePower
      price: $price
      description: $description
    ) {
      brand
    }
  }
`

export const RemoveCarMutation = gql`
  mutation removeCar($id: String!) {
    removeCar(id: $id) {
      id
    }
  }
`

export const UpdateCarMutation = gql`
  mutation updateCar($input: UpdateCarInput!) {
    updateCar(input: $input) {
      id
      brand
      model
      year
      mileage
      fuelType
      enginePower
      price
      description
    }
  }
`
