// "use client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, ShoppingCart, Star } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";

// // Tipe untuk produk
// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   bulkPrice: number;
//   minBulk: number;
//   rating: number;
//   image: string;
// };

// // Tipe untuk filter
// type FilterType =
//   | "category"
//   | "color"
//   | "size"
//   | "price"
//   | "availability"
//   | "sort";

// type SelectedFilters = {
//   [key in FilterType]: string;
// };

// // Data produk contoh
// const products: Product[] = [
//   {
//     id: 1,
//     name: "Custom Steel Tumbler",
//     price: 19900,
//     bulkPrice: 17900,
//     minBulk: 100,
//     rating: 1000,
//     image:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
//   },
//   {
//     id: 2,
//     name: "Custom Steel Tumbler",
//     price: 19900,
//     bulkPrice: 17900,
//     minBulk: 100,
//     rating: 1000,
//     image:
//       "https://images.unsplash.com/photo-1589363460779-c4e7d37cb8c7?w=400&h=400&fit=crop",
//   },
//   {
//     id: 3,
//     name: "Custom Steel Tumbler",
//     price: 19900,
//     bulkPrice: 17900,
//     minBulk: 100,
//     rating: 1000,
//     image:
//       "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
//   },
//   {
//     id: 4,
//     name: "Custom Steel Tumbler",
//     price: 19900,
//     bulkPrice: 17900,
//     minBulk: 100,
//     rating: 1000,
//     image:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
//   },
// ];

// // Opsi filter
// const filterOptions: Record<FilterType, string[]> = {
//   category: ["STAINLESS STEEL", "ALUMINUM", "GLASS", "PLASTIC"],
//   color: ["Black", "White", "Silver", "Blue", "Red", "Green"],
//   size: ["Small", "Medium", "Large", "Extra Large"],
//   price: [
//     "Low to High",
//     "High to Low",
//     "Under Rp 10,000",
//     "Rp 10,000 - Rp 30,000",
//   ],
//   availability: ["In Stock", "Out of Stock", "Pre-order"],
//   sort: [
//     "Best Selling",
//     "Newest",
//     "Price: Low to High",
//     "Price: High to Low",
//     "Rating",
//   ],
// };

// export default function ProductListing() {
//   const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
//     category: "STAINLESS STEEL",
//     color: "All",
//     size: "All",
//     price: "All",
//     availability: "All",
//     sort: "Best Selling",
//   });

//   const [visibleProducts, setVisibleProducts] = useState<number>(4);

//   const handleFilterChange = (filterType: FilterType, value: string): void => {
//     setSelectedFilters({
//       ...selectedFilters,
//       [filterType]: value,
//     });
//   };

//   const loadMoreProducts = (): void => {
//     setVisibleProducts((prev) => prev + 4);
//   };

//   // Format harga ke format Rupiah
//   const formatPrice = (price: number): string => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     })
//       .format(price)
//       .replace("Rp", "Rp ");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold tracking-tight">OUR PRODUCT</h1>
//         </div>

//         {/* Filter Bar */}
//         <div className="mb-10 flex flex-wrap gap-4">
//           {(Object.keys(filterOptions) as FilterType[]).map((filter) => (
//             <div key={filter} className="flex items-center">
//               <span className="mr-2 text-sm font-medium capitalize text-gray-700">
//                 {filter}:
//               </span>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-1 capitalize">
//                     {selectedFilters[filter]}
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="start">
//                   {filterOptions[filter].map((option) => (
//                     <DropdownMenuItem
//                       key={option}
//                       onClick={() => handleFilterChange(filter, option)}>
//                       {option}
//                     </DropdownMenuItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ))}
//         </div>

//         {/* Product Grid */}
//         <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//           {products.slice(0, visibleProducts).map((product) => (
//             <Card
//               key={product.id}
//               className="overflow-hidden border-gray-200 transition-shadow hover:shadow-lg">
//               <div className="aspect-square overflow-hidden bg-gray-100">
//                 {/* Menggunakan next/image untuk optimisasi */}
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   width={400}
//                   height={400}
//                   className="h-full w-full object-cover transition-transform hover:scale-105"
//                 />
//               </div>
//               <CardContent className="p-5">
//                 <h3 className="mb-2 line-clamp-1 text-lg font-semibold">
//                   {product.name}
//                 </h3>

//                 <div className="mb-3">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {formatPrice(product.price)}
//                     <span className="text-sm font-normal">/pcs</span>
//                   </div>
//                   <div className="text-lg text-gray-600">
//                     {formatPrice(product.bulkPrice)}
//                     <span className="text-sm">
//                       /pcs min. {product.minBulk} pcs
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                         />
//                       ))}
//                     </div>
//                     <span className="ml-2 text-sm text-gray-600">
//                       {product.rating.toLocaleString()} Satis
//                     </span>
//                   </div>

//                   <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
//                     <ShoppingCart className="mr-2 h-4 w-4" />
//                     Add
//                   </Button>
//                 </div>

//                 <Badge className="mt-4 border-none bg-green-100 text-green-800 hover:bg-green-100">
//                   Best Seller
//                 </Badge>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Load More Button */}
//         <div className="text-center">
//           <Button
//             onClick={loadMoreProducts}
//             variant="outline"
//             className="px-8 py-6 text-base"
//             disabled={visibleProducts >= products.length * 2}>
//             Load More Products
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function ProductsPage() {
  return (
    <div>
      <h1>products</h1>
    </div>
  );
}
