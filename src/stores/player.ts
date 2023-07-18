import { persistentAtom } from '@nanostores/persistent'
// import nanoid
import { nanoid } from 'nanoid'

export const playerId = persistentAtom('player', nanoid());

