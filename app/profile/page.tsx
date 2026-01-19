"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, MapPin, Package, User } from "lucide-react";

export default function ProfilePage() {
  // --- DUMMY DATA USER ---
  const userData = {
    name: "Ahmad Bagas",
    email: "ahmad.bagas@example.com",
    image: "/images/testimonials/contoh.png", // Ganti dengan path foto dummy Anda
    phone: "+62 812 3456 7890",
    joinDate: "Member since Jan 2024",
  };

  // --- DUMMY DATA PESANAN ---
  const orders = [
    {
      id: "INV-001",
      date: "12 Jan 2026",
      total: "Rp 350.000",
      status: "In Production",
    },
    {
      id: "INV-002",
      date: "05 Jan 2026",
      total: "Rp 1.200.000",
      status: "Shipped",
    },
    {
      id: "INV-003",
      date: "28 Des 2025",
      total: "Rp 500.000",
      status: "Completed",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header Profile Section */}
      <section className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-[#C4A48E]">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback className="bg-[#C4A48E] text-white text-2xl ">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h1 className="text-3xl  text-gray-900 mb-1">
                  {userData.name}
                </h1>
                <p className="text-gray-500 text-sm">{userData.email}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#C4A48E] font-bold mt-2">
                  {userData.joinDate}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="rounded-none border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content: Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <Tabs defaultValue="orders" className="w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation (TabsList) */}
              <TabsList className="flex lg:flex-col h-auto bg-transparent border-none lg:w-64 gap-1 lg:items-start p-0">
                <TabsTrigger
                  value="orders"
                  className="w-full justify-start gap-3 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none border-l-2 border-transparent data-[state=active]:border-[#C4A48E] text-gray-500 data-[state=active]:text-black transition-all">
                  <Package className="h-4 w-4" /> My Orders
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="w-full justify-start gap-3 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none border-l-2 border-transparent data-[state=active]:border-[#C4A48E] text-gray-500 data-[state=active]:text-black transition-all">
                  <User className="h-4 w-4" /> Personal Details
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="w-full justify-start gap-3 py-4 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-none border-l-2 border-transparent data-[state=active]:border-[#C4A48E] text-gray-500 data-[state=active]:text-black transition-all">
                  <MapPin className="h-4 w-4" /> Addresses
                </TabsTrigger>
              </TabsList>

              {/* Content Area */}
              <div className="grow">
                {/* --- TAB: ORDERS --- */}
                <TabsContent
                  value="orders"
                  className="m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="rounded-none border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className=" text-xl uppercase tracking-widest">
                        Order History
                      </CardTitle>
                      <CardDescription>
                        View and track your custom product orders.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-none border border-gray-100 overflow-hidden">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead className="font-bold">
                                Order ID
                              </TableHead>
                              <TableHead className="font-bold">Date</TableHead>
                              <TableHead className="font-bold">
                                Status
                              </TableHead>
                              <TableHead className="text-right font-bold">
                                Total
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => (
                              <TableRow
                                key={order.id}
                                className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-bold text-gray-900">
                                  {order.id}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                  {order.date}
                                </TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 text-[10px] uppercase font-bold bg-gray-100 rounded text-gray-600">
                                    {order.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-bold text-gray-900">
                                  {order.total}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* --- TAB: DETAILS --- */}
                <TabsContent
                  value="details"
                  className="m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="rounded-none border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className=" text-xl uppercase tracking-widest">
                        Personal Details
                      </CardTitle>
                      <CardDescription>
                        Update your personal information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Full Name
                          </Label>
                          <Input
                            defaultValue={userData.name}
                            className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Email Address
                          </Label>
                          <Input
                            defaultValue={userData.email}
                            className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Phone Number
                          </Label>
                          <Input
                            defaultValue={userData.phone}
                            className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                          />
                        </div>
                      </div>
                      <Button className="bg-black text-white rounded-none px-10 py-6 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-all">
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* --- TAB: ADDRESSES --- */}
                <TabsContent
                  value="address"
                  className="m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="rounded-none border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className=" text-xl uppercase tracking-widest">
                        Saved Addresses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border border-[#C4A48E]/30 bg-[#C4A48E]/5 p-6 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-[#C4A48E] text-white text-[9px] font-bold uppercase tracking-widest">
                              Default
                            </span>
                            <p className="font-bold uppercase text-[10px] tracking-widest">
                              Home Address
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Jl. Raya Malioboro No. 123 <br />
                            Gedong Tengen, Kota Yogyakarta <br />
                            Daerah Istimewa Yogyakarta, 55271 <br />
                            Indonesia
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#C4A48E] hover:text-[#C4A48E] hover:bg-white text-xs font-bold">
                          EDIT
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full border-2 border-dashed border-gray-100 mt-4 py-10 rounded-none text-gray-400 hover:bg-gray-50 transition-all">
                        + ADD NEW ADDRESS
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
