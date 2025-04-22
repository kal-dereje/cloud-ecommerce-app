// mockApi.ts

import { Product, User, Order } from '../types/types'; // Adjust the path if needed

let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Awesome T-Shirt',
    description: 'A high-quality t-shirt that feels great.',
    price: 25.99,
    currency: 'USD', // Assuming default currency
    stock: 100,
    category: 'Apparel', // Example category
    brand: 'Generic', // Example brand
    tags: ['casual', 'comfortable'], // Example tags
    imageUrls: ['/images/tshirt.jpg'],
    timesOrdered: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 3,
  },
  {
    id: '2',
    name: 'Stylish Jeans',
    description: 'Comfortable and fashionable jeans for any occasion.',
    price: 59.99,
    currency: 'USD',
    stock: 50,
    category: 'Apparel',
    brand: 'DenimCo',
    tags: ['fashion', 'denim'],
    imageUrls: ['/images/jeans.jpg'],
    timesOrdered: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Cool Sneakers',
    description: 'Perfect for running or casual wear.',
    price: 79.99,
    currency: 'USD',
    stock: 75,
    category: 'Footwear',
    brand: 'Stride',
    tags: ['sports', 'casual'],
    imageUrls: ['/images/sneakers.jpg'],
    timesOrdered: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Elegant Watch',
    description: 'A timeless piece to complement your style.',
    price: 129.99,
    currency: 'USD',
    stock: 30,
    category: 'Accessories',
    brand: 'TimeMaster',
    tags: ['luxury', 'classic'],
    imageUrls: ['/images/watch.jpg'],
    timesOrdered: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Cozy Hoodie',
    description: 'Stay warm and comfortable in this soft hoodie.',
    price: 49.99,
    currency: 'USD',
    stock: 120,
    category: 'Apparel',
    brand: 'ComfortWear',
    tags: ['casual', 'winter'],
    imageUrls: ['/images/hoodie.jpg'],
    timesOrdered: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.6,
  },
  {
    id: '6',
    name: 'Classic Cap',
    description: 'A versatile cap to complete your look.',
    price: 19.99,
    currency: 'USD',
    stock: 90,
    category: 'Accessories',
    brand: 'HeadGear',
    tags: ['casual', 'summer'],
    imageUrls: ['/images/cap.jpg'],
    timesOrdered: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 4.3,
  },
];

export const getMockProducts = async (): Promise<{ data: Product[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: Product[] = mockProducts;
      resolve({ data: mockData });
    }, 500); // Simulate a small network delay
  });
};

export const getMockProductById = async (
  id: string
): Promise<{ data: Product | undefined }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate fetching a single product by ID
      const product = mockProducts.find((p) => p.id === id);
      resolve({ data: product });
    }, 300); // Simulate a slightly faster response for single item
  });
};

export const mockSuccessfulLogin = async (
  email: string,
  password: string
): Promise<{ data: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful login based on provided credentials (for testing purposes only!)
      if (email === 'test@example.com' && password === 'password123') {
        const mockUser: User = {
          userId: 'user123',
          email: 'test@example.com',
          role: 'admin', // Assuming a default role
          fullName: 'Test User', // Example full name
          joinedAt: new Date().toISOString(),
          preferences: {
            language: 'en', // Example preference
            preferredCategory: 'Apparel', // Example preference
          },
        };
        resolve({ data: mockUser });
      } else {
        reject({ response: { data: { message: 'Invalid credentials' }, status: 401 } }); // Simulate login failure
      }
    }, 500); // Simulate a network delay
  });
};

export const mockPlaceOrderSuccess = async (payload: {
  items: { productId: string; quantity: number }[];
  total: number;
  currency: string; // Ensure currency is part of the payload
  shippingAddress: Order['shippingAddress']; // Include shipping address
}): Promise<{ data: { orderId: string } }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock API received order payload:', payload);
      // In a real mock, you might want to validate the payload
      // or simulate saving the order.
      const mockOrderId = `order-${Date.now()}`;
      resolve({ data: { orderId: mockOrderId } });
    }, 800); // Simulate a bit of processing time
  });
};

export const mockPlaceOrderFailure = async (payload: {
  items: { productId: string; quantity: number }[];
  total: number;
  currency: string; // Ensure currency is part of the payload
  shippingAddress: Order['shippingAddress']; // Include shipping address
}): Promise<any> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      console.error('Mock API received (and failed) order payload:', payload);
      reject({
        response: {
          data: { message: 'Failed to process order due to insufficient stock.' },
          status: 400,
        },
      });
    }, 600); // Simulate a different error delay
  });
};

export const mockGetOrderHistory = async (): Promise<{ data: Order[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock order data
      const mockOrders: Order[] = [
        {
          userId: 'user123', // Example userId
          orderId: 'order123',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          total: 75.5,
          currency: 'USD',
          status: 'Shipped',
          shippingAddress: {
            fullName: 'John Doe',
            addressLine1: '123 Main St',
            city: 'Fairfield',
            state: 'IA',
            postalCode: '52556',
            country: 'USA',
          },
          items: [
            {
              productId: '1',
              name: 'Awesome T-Shirt',
              price: 25.0,
              quantity: 2,
              subtotal: 50.0,
            },
            {
              productId: '2',
              name: 'Stylish Jeans',
              price: 25.5,
              quantity: 1,
              subtotal: 25.5,
            },
          ],
        },
        {
          userId: 'user123', // Example userId
          orderId: 'order456',
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
          total: 120.0,
          currency: 'USD',
          status: 'Delivered',
          shippingAddress: {
            fullName: 'John Doe',
            addressLine1: '123 Main St',
            city: 'Fairfield',
            state: 'IA',
            postalCode: '52556',
            country: 'USA',
          },
          items: [
            {
              productId: '3',
              name: 'Cool Sneakers',
              price: 60.0,
              quantity: 2,
              subtotal: 120.0,
            },
          ],
        },
      ];
      resolve({ data: mockOrders });
    }, 500); // Simulate network delay
  });
};

export const mockGetAdminProducts = async (): Promise<{ data: Product[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockProducts });
    }, 300); // Simulate network delay
  });
};

export const mockPostAdminProducts = async (
  newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'timesOrdered'>
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = String(Math.max(...mockProducts.map((p) => Number(p.id))) + 1); // Simple ID generation
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const timesOrdered = 0; // Default value for new products
      const createdProduct: Product = { id, createdAt, updatedAt, timesOrdered, ...newProduct };
      mockProducts.push(createdProduct);
      resolve();
    }, 500); // Simulate network delay
  });
};

export const mockDeleteAdminProducts = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProducts = mockProducts.filter((p) => p.id !== id);
      resolve();
    }, 400); // Simulate network delay
  });
};

export const mockPutAdminProducts = async (id: string, product: Product): Promise<{ data: Product }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedProduct = {
        ...product,
        id,
        updatedAt: new Date().toISOString(),
      };
      resolve({ data: updatedProduct });
    }, 500);
  });
};

let mockAdminOrders: Order[] = [
  {
    userId: 'adminUser', // Example userId
    orderId: 'order1',
    createdAt: new Date().toISOString(),
    total: 100,
    currency: 'USD',
    status: 'Pending',
    shippingAddress: {
      fullName: 'Admin User',
      addressLine1: 'Admin Address 1',
      city: 'Admin City',
      state: 'AA',
      postalCode: '00000',
      country: 'USA',
    },
    items: [
      { productId: 'p1', name: 'Product 1', price: 25, quantity: 4, subtotal: 100 },
    ],
  },
  {
    userId: 'anotherUser', // Example userId
    orderId: 'order2',
    createdAt: new Date().toISOString(),
    total: 50,
    currency: 'USD',
    status: 'Shipped',
    shippingAddress: {
      fullName: 'Another User',
      addressLine1: 'Another Address 1',
      city: 'Another City',
      state: 'BB',
      postalCode: '11111',
      country: 'USA',
    },
    items: [{ productId: 'p2', name: 'Product 2', price: 10, quantity: 5, subtotal: 50 }],
  },
];

export const mockGetAdminOrders = async (): Promise<{ data: Order[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockAdminOrders });
    }, 300);
  });
};

export const mockPatchAdminOrders = async (
  id: string,
  status: Order['status']
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = mockAdminOrders.findIndex((order) => order.orderId === id);
      if (orderIndex > -1) {
        mockAdminOrders[orderIndex] = {
          ...mockAdminOrders[orderIndex],
          status,
        };
        resolve();
      } else {
        reject({ response: { status: 404, data: { message: 'Order not found' } } }); // Reject with a 404
      }
    }, 400);
  });
};

interface Customer {
  id: string;
  email: string;
  orderCount: number;
}

const mockCustomers: Customer[] = [
  { id: 'user1', email: 'user1@example.com', orderCount: 3 },
  { id: 'user2', email: 'user2@example.com', orderCount: 1 },
  { id: 'admin1', email: 'admin1@example.com', orderCount: 5 },
  { id: 'guest1', email: 'guest1@example.com', orderCount: 0 },
];

export const mockGetCustomers = async (): Promise<{ data: Customer[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockCustomers });
    }, 300);
  });
};