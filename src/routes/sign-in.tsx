import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth/client";
import { SignIn, SignInSchema } from "@/services/auth.schema";
import { useForm } from "@tanstack/react-form";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { AtSign } from "lucide-react";

const signInSearchSchema = z.object({
  redirect: z.string().default('/')
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: signInSearchSchema,
  component: RouteComponent,
});

async function triggerSignIn({ email, password }: SignIn) {
  const { error, data } = await signIn
    .email({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
}

function RouteComponent() {
  const [waiting, setWaiting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as SignIn,
    validators: {
      onSubmit: SignInSchema
    },
    onSubmit: async ({ value }) => {
      setWaiting(true);

      await signInMutation.mutateAsync(value);

      setWaiting(false);
    }
  });

  const navigate = useNavigate();

  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: triggerSignIn,
    onSuccess: (res) => {
      queryClient.resetQueries();
      navigate({ to: redirectTo || '/' });
    },
    onError: (err) => {
      setErrorMessage(err.message);

      setWaiting(false);
    }
  });

  return (
    <div className="flex-1 h-screen flex flex-col justify-center items-center">
      <div className="flex-1 flex flex-col gap-4 p-4 px-8 max-w-[24rem] w-full h-fit grow-0 border border-border rounded-md">
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <h1 className="text-center capitalize font-mono text-lg mb-2">SIGN IN</h1>
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      spellCheck
                      type="email"
                      placeholder={"j.smith@wustl.edu"}
                    />
                    {isInvalid &&
                      <FieldError errors={field.state.meta.errors}/>
                    }
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="current-password"
                      spellCheck
                      type="password"
                    />
                    {isInvalid &&
                      <FieldError errors={field.state.meta.errors}/>
                    }
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
        {errorMessage &&
          <p className="text-destructive text-sm">{errorMessage}</p>
        }
        <div className="flex flex-row gap-4 items-center justify-between">
          <Button
            type="submit"
            form="sign-up-form"
            className="cursor-pointer flex flex-row items-center"
            disabled={waiting}
          >
            {waiting && <Spinner />}
            <span>Submit</span>
          </Button>
          <div className="text-sm text-right text-muted-foreground">
            <p>Don't have an account?</p>
            <a
              href="/sign-up"
              className="underline text-red-500/70 hover:text-red-500"
            >
              sign up
            </a>{" "}
            instead.
          </div>
        </div>
      </div>
       
    </div>
  );
}
