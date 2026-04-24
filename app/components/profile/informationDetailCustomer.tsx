"use client";

import {
  getMyOrders,
  getMyProfile,
  updateMyProfile,
} from "@/app/api/profile/customer-profile.api";
import { AddressManager } from "@/app/components/profile/addressManager";
import { CustomerProfile } from "@/app/types/customerProfile.type";
import { WebOrder } from "@/app/types/webOrder.type";
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
import { useRouter } from "@/i18n/routing";
import { LogOut, MapPin, Package, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSkeleton from "./profileCustomerSkeleton";

export default function InformationDetailCustomer() {
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();

  const [profileData, setProfileData] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<WebOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || status !== "authenticated") return;

    setLoading(true);
    try {
      const [profile, orderList] = await Promise.all([
        getMyProfile(token),
        getMyOrders(token),
      ]);

      if (profile) setProfileData(profile);
      setOrders(orderList);
    } catch (error) {
      console.error(error);
      if (status === "authenticated") toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
    // ✨ Tambahkan status di dependency array
  }, [token, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !profileData) return;

    setIsUpdating(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData.entries());

      const result = await updateMyProfile(token, payload);

      if (result.success) {
        toast.success(result.message);
        await fetchData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsUpdating(false);
    }
  };

  // ✨ PERBAIKAN LOGIKA REDIRECT ✨
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || (loading && token)) {
    return <ProfileSkeleton />;
  }

  // Jika profileData gagal dimuat tapi token ada (misal error API)
  if (!profileData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-stone-500 uppercase tracking-widest text-xs">
          Profile not found
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header Profile Section */}
      <section className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-[#C4A48E]">
                <AvatarImage
                  src={profileData?.user?.image || undefined}
                  alt={profileData?.user?.name}
                />
                <AvatarFallback className="bg-[#C4A48E] text-white text-2xl">
                  {profileData?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left">
                <h1 className="text-3xl text-gray-900 mb-1">
                  {profileData?.user?.name || "Loading..."}
                </h1>
                <p className="text-gray-500 text-sm">
                  {profileData?.user?.email || "Loading..."}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#C4A48E] font-bold mt-2">
                  {profileData?.createdAt || "Member since Jan 2024"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={async () => {
                setProfileData(null);
                setOrders([]);

                localStorage.clear();
                sessionStorage.clear();

                await signOut({
                  callbackUrl: "/login",
                  redirect: true,
                });
              }}
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
                <TabsContent value="orders">
                  <Card className="rounded-none border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl uppercase tracking-widest">
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
                            {orders.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="text-center py-10 text-stone-400">
                                  Belum ada riwayat pesanan.
                                </TableCell>
                              </TableRow>
                            ) : (
                              orders.map((order) => (
                                <TableRow
                                  key={order.id}
                                  className="hover:bg-gray-50/50 transition-colors">
                                  <TableCell className="font-bold text-gray-900">
                                    {order.orderNumber}
                                  </TableCell>
                                  <TableCell className="text-gray-500">
                                    {/* Format tanggal menggunakan built-in JS atau date-fns */}
                                    {new Date(
                                      order.createdAt,
                                    ).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${
                                        order.status === "COMPLETED"
                                          ? "bg-green-100 text-green-700"
                                          : order.status === "CANCELLED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-stone-100 text-stone-600"
                                      }`}>
                                      {order.status.replace("_", " ")}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-gray-900">
                                    Rp{" "}
                                    {Number(order.totalAmount).toLocaleString(
                                      "id-ID",
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
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
                      <CardTitle className="text-xl uppercase tracking-widest">
                        Personal Details
                      </CardTitle>
                      <CardDescription>
                        Update your {profileData?.accountType?.toLowerCase()}{" "}
                        information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Email Always Read Only (Standard Security) */}
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                              Email Address
                            </Label>
                            <Input
                              name="email"
                              defaultValue={profileData?.user?.email}
                              disabled
                              className="rounded-none border-gray-200 bg-gray-50 cursor-not-allowed"
                            />
                          </div>

                          {/* Kondisi INDIVIDUAL */}
                          {profileData?.accountType === "INDIVIDUAL" ? (
                            <>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  Full Name
                                </Label>
                                <Input
                                  name="name"
                                  defaultValue={profileData?.user?.name}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  Phone Number
                                </Label>
                                <Input
                                  name="phone"
                                  defaultValue={profileData?.phone || ""}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                            </>
                          ) : (
                            /* Kondisi CORPORATE */
                            <>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  Company Name
                                </Label>
                                <Input
                                  name="companyName"
                                  defaultValue={profileData?.companyName || ""}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  Department
                                </Label>
                                <Input
                                  name="department"
                                  defaultValue={profileData?.department || ""}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  PIC Name
                                </Label>
                                <Input
                                  name="picName"
                                  defaultValue={profileData?.picName || ""}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                                  PIC Phone (WhatsApp)
                                </Label>
                                <Input
                                  name="picPhone"
                                  defaultValue={profileData?.picPhone || ""}
                                  className="rounded-none border-gray-200 focus:border-[#C4A48E] focus:ring-0"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="bg-black text-white rounded-none px-10 py-6 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-all">
                          {isUpdating ? "Updating..." : "Update Profile"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* --- TAB: ADDRESSES --- */}
                <TabsContent
                  value="address"
                  className="m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AddressManager />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
