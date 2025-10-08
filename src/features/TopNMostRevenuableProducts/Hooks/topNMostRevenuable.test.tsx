import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTopNMostRevenuableProductsHook, DateEnum } from './topNMostRevenuable'; // Fixed import path
import { useLocation } from 'react-router';
import { useTopNMostRevenuableProducts } from './APIHooks/useTopNMostRevenuableProducts'; // Fixed import path

// Mock کردن هوک useLocation از react-router
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
}));

// Mock کردن هوک API سفارشی که useTopNMostRevenuableProductsHook به آن وابسته است
vi.mock('./APIHooks/useTopNMostRevenuableProducts', () => ({
  useTopNMostRevenuableProducts: vi.fn(),
}));

// تابع کمکی برای ایجاد یک Wrapper برای تست‌ها (QueryClientProvider)
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // غیرفعال کردن تلاش مجدد برای نتایج تست قابل پیش‌بینی
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// داده‌های Mock نمونه برای پاسخ API
const mockProductsRevenue = [
  {
    productName: 'Product A',
    formattedSalesRevenuAmount: '100.00',
    formattedPurchaseAmount: '50.00',
  },
  {
    productName: 'Product B',
    formattedSalesRevenuAmount: '200.00',
    formattedPurchaseAmount: '100.00',
  },
];

const mockProductsPercentage = [
  {
    productName: 'Product C',
    formattedSalesRevenuAmount: '50.00',
    formattedPurchaseAmount: '20.00',
  },
  {
    productName: 'Product D',
    formattedSalesRevenuAmount: '150.00',
    formattedPurchaseAmount: '75.00',
  },
];

describe('useTopNMostRevenuableProductsHook', () => {
  beforeEach(() => {
    // پاک کردن تمام Mock ها قبل از هر تست برای اطمینان از ایزوله‌سازی
    vi.clearAllMocks();
    // پیاده‌سازی Mock پیش‌فرض برای useLocation
    (useLocation as any).mockReturnValue({ state: {} });
    // پیاده‌سازی Mock پیش‌فرض برای useTopNMostRevenuableProducts
    // این به صورت پیش‌فرض یک دریافت داده موفق را شبیه‌سازی می‌کند
    (useTopNMostRevenuableProducts as any).mockReturnValue({
      data: {
        Data: {
          topNMostRevenuableProducts: mockProductsRevenue,
          topNMostRevenuableProductsByRevenuPercentage: mockProductsPercentage,
        },
      },
      isPending: false,
      isError: false,
    });
  });

  it('باید با مقادیر پیش‌فرض مقداردهی اولیه شود و داده‌ها را با موفقیت دریافت کند', async () => {
    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    // Since the mock returns isPending: false immediately, loading should be false
    expect(result.current.loading).toBe(false);
    expect(result.current.topRevenuableProducts).toEqual(mockProductsRevenue);

    // assertions پس از بارگذاری داده‌ها
    expect(result.current.selectedChip).toBe(DateEnum.Last7Days);
    expect(result.current.filterByRevenue).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.totalRevenue).toBe(300); // 100 + 200
    expect(result.current.totalProfit).toBe(150); // (100-50) + (200-100) = 50 + 100
    expect(useTopNMostRevenuableProducts).toHaveBeenCalledWith(DateEnum.Last7Days);
  });

  it('باید با مقادیر از location state مقداردهی اولیه شود و داده‌ها را با موفقیت دریافت کند', async () => {
    (useLocation as any).mockReturnValue({
      state: { date: DateEnum.Yesterday, filterByRevenue: false },
    });

    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    expect(result.current.loading).toBe(false);

    expect(result.current.selectedChip).toBe(DateEnum.Yesterday);
    expect(result.current.filterByRevenue).toBe(false);
    // وقتی filterByRevenue false باشد، باید از topNMostRevenuableProductsByRevenuPercentage استفاده کند
    expect(result.current.topRevenuableProducts).toEqual(mockProductsPercentage);
    expect(result.current.totalRevenue).toBe(200); // 50 + 150
    expect(result.current.totalProfit).toBe(105); // (50-20) + (150-75) = 30 + 75
    expect(useTopNMostRevenuableProducts).toHaveBeenCalledWith(DateEnum.Yesterday);
  });

  it('باید وضعیت loading را زمانی که داده‌ها در حال انتظار هستند نشان دهد', async () => {
    (useTopNMostRevenuableProducts as any).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    });

    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.topRevenuableProducts).toEqual([]);
    expect(result.current.totalRevenue).toBe(0);
    expect(result.current.totalProfit).toBe(0);

    // نیازی به waitFor در اینجا نیست زیرا ما خود وضعیت pending را تست می‌کنیم
  });

  it('باید وضعیت خطا را زمانی که دریافت داده‌ها با شکست مواجه می‌شود نشان دهد', async () => {
    (useTopNMostRevenuableProducts as any).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    // منتظر بمانید تا هوک وضعیت خطا را ثبت کند
    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('خطا در دریافت اطلاعات کالاهای پرسود');
    expect(result.current.topRevenuableProducts).toEqual([]);
    expect(result.current.totalRevenue).toBe(0);
    expect(result.current.totalProfit).toBe(0);
  });

  it('باید selectedChip را زمانی که handleChipClick فراخوانی می‌شود به‌روزرسانی کند و داده‌ها را مجدداً دریافت کند', async () => {
    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    // Since mock returns isPending: false immediately, loading should be false
    expect(result.current.loading).toBe(false);
    expect(result.current.selectedChip).toBe(DateEnum.Last7Days);
    expect(useTopNMostRevenuableProducts).toHaveBeenCalledWith(DateEnum.Last7Days);

    // تاریخچه فراخوانی Mock را قبل از عمل پاک کنید تا فراخوانی‌های جدید بررسی شوند
    vi.clearAllMocks();
    (useTopNMostRevenuableProducts as any).mockReturnValue({
      data: {
        Data: {
          topNMostRevenuableProducts: mockProductsRevenue, // فرض بر این است که داده‌های مشابهی در دریافت مجدد وجود دارد
          topNMostRevenuableProductsByRevenuPercentage: mockProductsPercentage,
        },
      },
      isPending: false,
      isError: false,
    });

    act(() => {
      result.current.handleChipClick(DateEnum.Yesterday);
    });

    // Since the mock returns isPending: false immediately, loading should be false
    expect(result.current.loading).toBe(false);

    expect(result.current.selectedChip).toBe(DateEnum.Yesterday);
    expect(useTopNMostRevenuableProducts).toHaveBeenCalledWith(DateEnum.Yesterday);
    expect(result.current.topRevenuableProducts).toEqual(mockProductsRevenue); // داده‌ها باید پس از دریافت مجدد به‌روز شوند
  });

  it('باید filterByRevenue و topRevenuableProducts را زمانی که handleFilterChange فراخوانی می‌شود به‌روزرسانی کند', async () => {
    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    // Since mock returns isPending: false immediately, loading should be false
    expect(result.current.loading).toBe(false);

    // وضعیت اولیه: filterByRevenue true است، از mockProductsRevenue استفاده می‌شود
    expect(result.current.filterByRevenue).toBe(true);
    expect(result.current.topRevenuableProducts).toEqual(mockProductsRevenue);
    expect(result.current.totalRevenue).toBe(300);
    expect(result.current.totalProfit).toBe(150);

    // عمل: تغییر فیلتر به درصد
    act(() => {
      result.current.handleFilterChange(false);
    });

    // بررسی به‌روزرسانی وضعیت و تغییر لیست محصولات بلافاصله (فراخوانی ناهمگام در اینجا وجود ندارد)
    expect(result.current.filterByRevenue).toBe(false);
    expect(result.current.topRevenuableProducts).toEqual(mockProductsPercentage);
    expect(result.current.totalRevenue).toBe(200); // مجدداً برای محصولات درصدی محاسبه شد
    expect(result.current.totalProfit).toBe(105); // مجدداً برای محصولات درصدی محاسبه شد

    // عمل: تغییر فیلتر به درآمد
    act(() => {
      result.current.handleFilterChange(true);
    });

    // بررسی به‌روزرسانی وضعیت و بازگشت لیست محصولات
    expect(result.current.filterByRevenue).toBe(true);
    expect(result.current.topRevenuableProducts).toEqual(mockProductsRevenue);
    expect(result.current.totalRevenue).toBe(300); // مجدداً برای محصولات درآمدی محاسبه شد
    expect(result.current.totalProfit).toBe(150); // مجدداً برای محصولات درآمدی محاسبه شد
  });

  it('باید totalRevenue و totalProfit را با داده‌های معتبر/نامعتبر مخلوط به درستی محاسبه کند', async () => {
    (useTopNMostRevenuableProducts as any).mockReturnValue({
      data: {
        Data: {
          topNMostRevenuableProducts: [
            { productName: 'P1', formattedSalesRevenuAmount: '10.00', formattedPurchaseAmount: '5.00' },
            { productName: 'P2', formattedSalesRevenuAmount: 'invalid', formattedPurchaseAmount: '2.00' }, // درآمد نامعتبر
            { productName: 'P3', formattedSalesRevenuAmount: '20.00', formattedPurchaseAmount: 'invalid' }, // خرید نامعتبر
            { productName: 'P4', formattedSalesRevenuAmount: '30.00', formattedPurchaseAmount: '10.00' },
          ],
          topNMostRevenuableProductsByRevenuPercentage: [],
        },
      },
      isPending: false,
      isError: false,
    });

    const { result } = renderHook(() => useTopNMostRevenuableProductsHook(), { wrapper: createTestWrapper() });

    expect(result.current.loading).toBe(false);

    // (10) + (0) + (20) + (30) = 60
    expect(result.current.totalRevenue).toBe(60);
    // (10-5) + (NaN-2||0) + (20-NaN||0) + (30-10) = 5 + 0 + 0 + 20 = 25
    expect(result.current.totalProfit).toBe(25);
  });
});
