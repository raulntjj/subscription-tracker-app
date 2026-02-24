"use client";

import { useRegister } from "@/modules/auth/hooks/use-commands";
import {
  type RegisterFormData,
  registerSchema,
} from "@/modules/auth/lib/validations/register";
import { useTranslation } from "@/modules/shared/hooks/use-translation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterForm() {
  const { t } = useTranslation();
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => registerUser(data);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t("createYourAccount")}</CardTitle>
        <CardDescription>
          {t("getStarted")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t("firstName")}</Label>
              <Input
                id="name"
                placeholder={t("firstNamePlaceholder")}
                autoComplete="given-name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="surname">{t("lastName")}</Label>
              <Input
                id="surname"
                placeholder={t("lastNamePlaceholder")}
                autoComplete="family-name"
                aria-invalid={!!errors.surname}
                {...register("surname")}
              />
              {errors.surname && (
                <p className="text-xs text-destructive">{errors.surname.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-email">{t("email")}</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-password">{t("password")}</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password_confirmation">{t("confirmPassword")}</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              aria-invalid={!!errors.password_confirmation}
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <p className="text-xs text-destructive">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("creatingAccount")}
              </>
            ) : (
              t("createAccount")
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("signInLink")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
