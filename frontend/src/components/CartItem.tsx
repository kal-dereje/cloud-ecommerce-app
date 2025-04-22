import React from 'react';
import { CartItem } from '../types/types';
import { useAtom } from 'jotai';
import { cartAtom } from '../atoms/cartAtom';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  item: CartItem;
  imageUrl?: string; // Optional, derived from Product.imageUrls[0]
}

const CartItemComp: React.FC<Props> = ({ item, imageUrl }) => {
  const [, setCart] = useAtom(cartAtom);

  const updateQty = (delta: number) => {
    setCart((curr) =>
      curr.flatMap((ci) => {
        if (ci.productId === item.productId) {
          const qty = ci.quantity + delta;
          if (qty < 1) return [];
          return [{ ...ci, quantity: qty }];
        }
        return [ci];
      })
    );
  };

  const removeItem = () => {
    setCart((curr) => curr.filter((ci) => ci.productId !== item.productId));
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative">
        <img
          src={imageUrl || 'https://placehold.co/64x64'}
          alt={item.name}
          className="h-20 w-20 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/64x64';
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
        />
        <button
          onClick={removeItem}
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 shadow-md"
          aria-label="Remove item"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
        <p className="text-slate-600">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => updateQty(-1)}
          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-200"
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="text-slate-800 font-medium min-w-[2rem] text-center">{item.quantity}</span>
        <button
          onClick={() => updateQty(1)}
          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all duration-200"
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="text-right min-w-[6rem]">
        <p className="text-sm text-slate-500">Subtotal</p>
        <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItemComp;