"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Import fungsi API kamu
import { getSearchArticlesAPI } from "@/app/api/articles/getSearchArticle.api";
import { getSearchPortfoliosAPI } from "@/app/api/portfolio/getSearchPortfolio.api";
import { getFilteredProductsAPI } from "@/app/api/products/getFilteredProduct.api";

// Import komponen-komponen UI
import { ArticleCard } from "@/app/components/articleCard";
import { PortfolioCard } from "@/app/components/portfolioCard";
import { LoadMoreButton } from "@/app/components/products/Loadmorebutton";
import { ProductGrid } from "@/app/components/products/Productgrid";
import { Skeleton } from "@/components/ui/skeleton";

//  TAMBAHAN: Import komponen Tabs dari shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =====================================================================
// FUNGSI HELPER UNTUK FORMAT DATA ARTIKEL
// =====================================================================
const stripHtml = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "");
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const formatArticleData = (item: any, locale: string) => {
  const mappedTitle =
    locale === "en" && item.title_en ? item.title_en : item.title_id;
  const mappedContent =
    locale === "en" && item.content_en ? item.content_en : item.content_id;
  const categoryName =
    locale === "en" && item.category?.name_en
      ? item.category.name_en
      : item.category?.name_id || "Uncategorized";
  const plainText = stripHtml(mappedContent || "");

  return {
    id: item.id,
    title: mappedTitle,
    excerpt:
      plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText,
    image: item.coverImage || "/images/articles/article-placeholder.jpg",
    category: categoryName,
    date: new Date(item.publishedAt || item.createdAt).toLocaleDateString(
      locale === "en" ? "en-US" : "id-ID",
      { month: "long", day: "numeric", year: "numeric" },
    ),
    href: `/article/${item.slug || item.id}`,
  };
};

// =====================================================================
// KOMPONEN UTAMA
// =====================================================================
export default function GlobalSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const locale = useLocale();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  //  TAMBAHAN: State untuk mengatur tab mana yang sedang aktif
  const [activeTab, setActiveTab] = useState("products");

  // --- STATE UNTUK PRODUK ---
  const [products, setProducts] = useState<any[]>([]);
  const [prodPage, setProdPage] = useState(1);
  const [prodHasMore, setProdHasMore] = useState(false);
  const [isLoadingMoreProd, setIsLoadingMoreProd] = useState(false);

  // --- STATE UNTUK ARTIKEL ---
  const [articles, setArticles] = useState<any[]>([]);
  const [artPage, setArtPage] = useState(1);
  const [artHasMore, setArtHasMore] = useState(false);
  const [isLoadingMoreArt, setIsLoadingMoreArt] = useState(false);

  // --- STATE UNTUK PORTOFOLIO ---
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [portPage, setPortPage] = useState(1);
  const [portHasMore, setPortHasMore] = useState(false);
  const [isLoadingMorePort, setIsLoadingMorePort] = useState(false);

  const getUserCountryFromCookie = (): string => {
    if (typeof document === "undefined") return "ID";
    const match = document.cookie.match(/(^|;)\s*USER_COUNTRY\s*=\s*([^;]+)/);
    return match ? match[2] : "ID";
  };

  // 1. FETCH PERTAMA KALI (INITIAL LOAD)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!query) {
        setIsInitialLoading(false);
        return;
      }
      setIsInitialLoading(true);

      const country = getUserCountryFromCookie();

      try {
        const [prodRes, artRes, portRes] = await Promise.all([
          getFilteredProductsAPI({} as any, 1, query, country, locale),
          getSearchArticlesAPI(query, 1, locale),
          getSearchPortfoliosAPI(query, 1, locale),
        ]);

        setProducts(prodRes.data || []);
        setProdHasMore(prodRes.meta?.hasNext || false);
        setProdPage(1);

        const formattedArticles = (artRes.data || []).map((item: any) =>
          formatArticleData(item, locale),
        );
        setArticles(formattedArticles);
        setArtHasMore(artRes.meta?.hasNext || false);
        setArtPage(1);

        setPortfolios(portRes.data || []);
        setPortHasMore(portRes.meta?.hasNext || false);
        setPortPage(1);
      } catch (error) {
        console.error("Error fetching initial search results:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [query, locale]);

  // 2. FUNGSI LOAD MORE PRODUK
  const handleLoadMoreProducts = async () => {
    setIsLoadingMoreProd(true);
    const nextPage = prodPage + 1;
    const country = getUserCountryFromCookie();

    const res = await getFilteredProductsAPI(
      {} as any,
      nextPage,
      query,
      country,
      locale,
    );
    setProducts((prev) => [...prev, ...(res.data || [])]);
    setProdHasMore(res.meta?.hasNext || false);
    setProdPage(nextPage);
    setIsLoadingMoreProd(false);
  };

  // 3. FUNGSI LOAD MORE ARTIKEL
  const handleLoadMoreArticles = async () => {
    setIsLoadingMoreArt(true);
    const nextPage = artPage + 1;

    const res = await getSearchArticlesAPI(query, nextPage, locale);
    const formattedNewArticles = (res.data || []).map((item: any) =>
      formatArticleData(item, locale),
    );

    setArticles((prev) => [...prev, ...formattedNewArticles]);
    setArtHasMore(res.meta?.hasNext || false);
    setArtPage(nextPage);
    setIsLoadingMoreArt(false);
  };

  // 4. FUNGSI LOAD MORE PORTOFOLIO
  const handleLoadMorePortfolios = async () => {
    setIsLoadingMorePort(true);
    const nextPage = portPage + 1;

    const res = await getSearchPortfoliosAPI(query, nextPage, locale);
    setPortfolios((prev) => [...prev, ...(res.data || [])]);
    setPortHasMore(res.meta?.hasNext || false);
    setPortPage(nextPage);
    setIsLoadingMorePort(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Hasil Pencarian */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {locale === "en" ? "Search Results" : "Hasil Pencarian"}
          </h1>
          <p className="text-stone-500">
            {locale === "en"
              ? "Showing results for:"
              : "Menampilkan hasil untuk:"}{" "}
            <span className="font-semibold text-stone-800">
              &quot;{query}&quot;
            </span>
          </p>
        </div>

        {isInitialLoading ? (
          <div className="space-y-12">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          /*  UBAH: Layout yang awalnya numpuk vertikal kini digabung menggunakan Tabs */
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            {/* Navigasi Tab */}
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full md:w-125 grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: PRODUCTS */}
            <TabsContent
              value="products"
              forceMount={true}
              hidden={activeTab !== "products"}
              className="mt-0">
              {products.length > 0 ? (
                <>
                  <ProductGrid products={products} isLoading={false} />
                  {prodHasMore && (
                    <div className="mt-8">
                      <LoadMoreButton
                        onClick={handleLoadMoreProducts}
                        isLoading={isLoadingMoreProd}
                        hasMore={prodHasMore}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                  <p className="text-stone-500 italic">
                    {locale === "en"
                      ? "No products found."
                      : "Tidak ada produk ditemukan."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: ARTICLES */}
            <TabsContent
              value="articles"
              forceMount={true}
              hidden={activeTab !== "articles"}
              className="mt-0">
              {articles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  {artHasMore && (
                    <div className="mt-8">
                      <LoadMoreButton
                        onClick={handleLoadMoreArticles}
                        isLoading={isLoadingMoreArt}
                        hasMore={artHasMore}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                  <p className="text-stone-500 italic">
                    {locale === "en"
                      ? "No articles found."
                      : "Tidak ada artikel ditemukan."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: PORTFOLIOS */}
            <TabsContent
              value="portfolios"
              forceMount={true}
              hidden={activeTab !== "portfolios"}
              className="mt-0">
              {portfolios.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((porto) => (
                      <PortfolioCard key={porto.id} item={porto} />
                    ))}
                  </div>
                  {portHasMore && (
                    <div className="mt-8">
                      <LoadMoreButton
                        onClick={handleLoadMorePortfolios}
                        isLoading={isLoadingMorePort}
                        hasMore={portHasMore}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
                  <p className="text-stone-500 italic">
                    {locale === "en"
                      ? "No portfolios found."
                      : "Tidak ada portofolio ditemukan."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
