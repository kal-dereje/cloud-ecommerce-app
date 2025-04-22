import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
interface Props { rating: number; }
const ReviewStars: React.FC<Props> = ({ rating }) => (
  <div className="flex">
    {Array.from({length:5}, (_, i) => (
      <StarIcon key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);
export default ReviewStars;
