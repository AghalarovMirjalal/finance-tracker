import AuthProvider from "@/context/auth-provider";
import FinanceProvider from "@/context/finance-provider";
import ThemeProvider from "@/context/theme-provider";
import LayoutContent from "@/layout/layout";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <LayoutContent />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
