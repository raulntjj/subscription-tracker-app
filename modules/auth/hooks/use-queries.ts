import { useEffect } from "react";

import { getMeAction } from "@/modules/auth/actions/get-me-action";
import { useAuthStore } from "@/modules/auth/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await getMeAction();
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      clearUser();
    }
  }, [query.data, query.isError, setUser, clearUser]);

  return query;
}
