import { useI18nStore } from "@/modules/shared/store/i18n-store";
import Cookies from "js-cookie";

jest.mock("js-cookie");

beforeEach(() => {
  jest.clearAllMocks();
  useI18nStore.setState({ locale: "en" });
});

describe("useI18nStore", () => {
  it("has 'en' as the default locale", () => {
    const { locale } = useI18nStore.getState();
    expect(locale).toBe("en");
  });

  it("setLocale updates the locale in the store", () => {
    const { setLocale } = useI18nStore.getState();
    setLocale("pt-BR");
    expect(useI18nStore.getState().locale).toBe("pt-BR");
  });

  it("setLocale persists the locale to a cookie", () => {
    const { setLocale } = useI18nStore.getState();
    setLocale("pt-BR");
    expect(Cookies.set).toHaveBeenCalledWith(
      "NEXT_LOCALE",
      "pt-BR",
      expect.objectContaining({ path: "/", sameSite: "lax" }),
    );
  });

  it("setLocale persists locale to localStorage", () => {
    const setItem = jest.spyOn(Storage.prototype, "setItem");
    const { setLocale } = useI18nStore.getState();
    setLocale("pt-BR");
    expect(setItem).toHaveBeenCalledWith("NEXT_LOCALE", "pt-BR");
    setItem.mockRestore();
  });
});
