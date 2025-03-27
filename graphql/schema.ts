import { builder } from './builder'
import './types/User'
import './types/Car'

export const schema = builder.toSchema()
