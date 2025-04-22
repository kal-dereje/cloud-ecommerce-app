export interface Product {
    id: string; // PK: UUID from Products table
    name: string; // Renamed from 'title' to match schema's 'name'
    description: string;
    price: number;
    discountPrice?: number; // Optional, as per schema
    currency: string;
    stock: number;
    category: string;
    brand: string;
    tags: string[]; // List of strings in schema
    imageUrls: string[]; // List of strings, renamed from 'imageUrl' to match schema
    timesOrdered: number;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    rating?: number; // Optional, retained from original for potential average rating
  }
  
  export interface CartItem {
    productId: string; // From Cart table's cartItems.productId
    name: string; // From Cart table's cartItems.name
    price: number; // From Cart table's cartItems.price
    quantity: number; // From Cart table's cartItems.quantity
  }
  
  export interface Order {
    userId: string; // PK: Cognito sub from Orders table
    orderId: string; // SK: UUID, renamed from 'id' to match schema
    items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[]; // List of items from Orders table
    total: number;
    currency: string;
    status: 'Pending' | 'Shipped' | 'Delivered'; // Enum for status
    shippingAddress: {
      fullName: string;
      addressLine1: string;
      addressLine2?: string; // Optional
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    createdAt: string; // ISO timestamp
  }
  
  export interface User {
    userId: string; // PK: Cognito sub from Users table
    email: string;
    role: 'customer' | 'admin'; // Renamed from 'groups' to match schema's role
    fullName: string;
    joinedAt: string; // ISO timestamp
    preferences: {
      language: string;
      preferredCategory: string;
    };
  }
  
  export interface Review {
    productId: string; // PK from Reviews table
    userId: string; // SK from Reviews table
    rating: number; // 1–5
    comment: string;
    createdAt: string; // ISO timestamp
  }