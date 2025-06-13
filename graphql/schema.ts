import { builder } from './builder'
import './types/User'
import './types/Car'
import './types/Invoice'
import './types/Subscription'

export const schema = builder.toSchema()
