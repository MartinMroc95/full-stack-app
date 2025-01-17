import { builder } from './builder'
import './types/Link'
import './types/User'
import './types/Car'

export const schema = builder.toSchema()
