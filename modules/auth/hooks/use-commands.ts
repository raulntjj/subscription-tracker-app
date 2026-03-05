import { useRouter } from 'next/navigation';

import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { User } from '@/modules/auth/types/auth-types';
import { useAuthStore } from '@/modules/auth/store/auth-store';
import { ApiResponse } from '@/modules/shared/types/api-types';
import { loginAction } from '@/modules/auth/actions/login-action';
import { logoutAction } from '@/modules/auth/actions/logout-action';
import { registerAction } from '@/modules/auth/actions/register-action';
import type { LoginFormData } from '@/modules/auth/lib/validations/login';
import type { RegisterFormData } from '@/modules/auth/lib/validations/register';

import { authKeys } from './use-queries';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginFormData) => loginAction(payload),
    onSuccess: async (response: ApiResponse<{ user?: User }>) => {
      toast.success(response.message || 'Bem-vindo de volta!');
      if (response.data) {
        const data = response.data as { user?: User };
        if (data.user) {
          setUser(data.user);
          queryClient.setQueryData(authKeys.me(), { data: data.user });
        }
      }
      router.push('/subscriptions');
    },
    onError: (error: ApiResponse<unknown>) => {
      const message = error?.message || 'Falha no login. Tente novamente.';
      toast.error(message);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: RegisterFormData) => registerAction(payload),
    onSuccess: async (response: ApiResponse<{ user?: User }>) => {
      toast.success(response.message || 'Conta criada com sucesso');
      if (response.data) {
        const data = response.data;
        if (data.user) {
          setUser(data.user);
          queryClient.setQueryData(authKeys.me(), { data: data.user });
        }
      }
      router.push('/subscriptions');
    },
    onError: (error: ApiResponse<unknown>) => {
      const message = error?.message || 'Falha no login. Tente novamente.';
      toast.error(message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      router.push('/login');
      toast.success('Logout realizado com sucesso');
    },
    onError: () => {
      toast.error('Falha ao realizar logout');
    },
  });
}
