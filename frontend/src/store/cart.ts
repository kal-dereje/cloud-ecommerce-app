import { atom } from 'jotai'

export type Product = {
  id: string
  name: string
  price: number
}

export const cartAtom = atom<Product[]>([])
