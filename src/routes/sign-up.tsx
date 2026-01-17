import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { signIn, signUp } from "@/lib/auth/client";
import { Profile, SignUp, SignUpSchema } from "@/services/auth.schema";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowRight, AtSign, AtSignIcon, Info, InfoIcon, StarIcon, TriangleAlert } from "lucide-react";
import { ReactFormExtendedApi, useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createProfile } from "@/services/auth.api";
import { ExtendedField, ExtendedLabel, UsernameField } from "@/components/Form";
import { checkSimilarName, checkUsernameTaken } from "@/services/user.api";
import { cn } from "@/lib/utils";

const signUpSearchSchema = z.object({
  redirect: z.string().default('/')
});

export const Route = createFileRoute("/sign-up")({
  validateSearch: signUpSearchSchema,
  component: RouteComponent,
});

async function triggerSignUp(inputData: SignUp) {
  const { error, data } = await signUp
    .email({
      name: inputData.name,
      email: inputData.email,
      password: inputData.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  await createProfile({
    data: {
      ...inputData,
      userId: data.user.id
    }
  });

  return data;
}

function RouteComponent() {
  const [waiting, setWaiting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    validators: {
      onSubmit: SignUpSchema
    },
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    } as SignUp,
    onSubmit: async ({ value }) => {
      setWaiting(true);

      const usernameTaken = await checkUsernameTaken({ data: { username: value.username } });

      if (usernameTaken && !profileClaimed) {
        return setErrorMessage("Username is taken!");
      }

      await signUpMutation.mutateAsync(value);

      setWaiting(false);
    }
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const signUpMutation = useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: triggerSignUp,
    onSuccess: (res) => {
      queryClient.resetQueries();
      navigate({ to: redirectTo || '/' });
    },
    onError: (err) => {
      setErrorMessage(err.message);

      setWaiting(false);
    }
  });
  
  const { redirect: redirectTo } = Route.useSearch();

  const [similarProfile, setSimilarProfile] = useState<Profile | null>(null);
  const [profileClaimed, setProfileClaimed] = useState(false);

  return (
    <div className="flex-1 h-screen flex flex-row justify-center items-center mt-10 pb-8">
      <div className={cn(
        "bg-background border border-border transition-all duration-500 w-[24rem] rounded-md flex flex-col gap-2 items-start overflow-hidden",
        {
          "-mr-[24rem]": similarProfile === null,
          "-mr-6": similarProfile !== null
        }
      )}>
        <div className="p-4 pr-8 border-b border-border">
          <p className="text-nowrap pb-1">Is this you?</p>
          <p className="text-foreground/80 text-sm line-clamp-2">A similar profile already exists, do you want to associate it with your new account?</p>
          <p className="flex flex-row items-center text-xs gap-1 pt-1 text-foreground/60 line-clamp-1">
            <TriangleAlert className="w-4"/>
            Note: you will need to verify your email
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 gap-y-4 text-sm p-4 pr-8">
          <div>
              <p className="font-mono text-foreground/60 uppercase text-xs">Name</p>
              <p>{similarProfile?.name}</p>
          </div>
          <div>
              <p className="font-mono text-foreground/60 uppercase text-xs">Username</p>
              <p className="flex flex-row items-center gap-1">
                <AtSignIcon className="w-4"/>
                {similarProfile?.username}
              </p>
          </div>
          <div>
              <p className="font-mono text-foreground/60 uppercase text-xs">Email</p>
              <p>{similarProfile?.email}</p>
          </div>
        </div>
        <div className="p-4 pt-3 pr-8 border-t border-border w-full flex flex-row gap-2">
          <Button onClick={() => {
            form.setFieldValue("email", similarProfile!.email);
            form.setFieldValue("name", similarProfile!.name);
            form.setFieldValue("username", similarProfile!.username);
            setProfileClaimed(true);
            setSimilarProfile(null);
          }}>
            Claim profile
            <ArrowRight />
          </Button>
          <Button variant='outline' onClick={() => setSimilarProfile(null)}>
            Cancel
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 px-8 max-w-[24rem] w-full h-fit grow-0 border border-border rounded-md bg-deep-background">
        <form
          id="sign-up-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <h1 className="text-center capitalize font-mono text-lg mb-6">SIGN UP</h1>
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <ExtendedField isInvalid={isInvalid} field={field} locked={profileClaimed}>
                    <ExtendedLabel name={field.name} locked={profileClaimed}>Full name (first and last)</ExtendedLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={async () => {
                        field.handleBlur();

                        if (field.state.value.length <= 5)
                          return;

                        const profile = await checkSimilarName({ data: { name: field.state.value } });

                        console.log(profile);

                        if (profile) {
                          setSimilarProfile({ ...profile, memberSince: new Date(profile.memberSince??"") } as Profile);
                        }
                      }}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={profileClaimed}
                      autoComplete="name"
                      spellCheck
                      type="text"
                      placeholder={"John Smith"}
                    />
                    {isInvalid &&
                      <FieldError errors={field.state.meta.errors}/>
                    }
                  </ExtendedField>
                )
              }}
            />

            <UsernameField
              form={form}
              locked={profileClaimed}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <ExtendedField isInvalid={isInvalid} field={field}>
                    <ExtendedLabel name={field.name} locked={profileClaimed}>Email</ExtendedLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={profileClaimed}
                      autoComplete="email"
                      spellCheck
                      type="email"
                      placeholder={"j.smith@wustl.edu"}
                    />
                    {isInvalid &&
                      <FieldError errors={field.state.meta.errors}/>
                    }
                  </ExtendedField>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                
                return (
                  <ExtendedField isInvalid={isInvalid} field={field}>
                    <ExtendedLabel name={field.name}>Password</ExtendedLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                      spellCheck
                      type="password"
                    />
                    {isInvalid &&
                      <FieldError errors={field.state.meta.errors}/>
                    }
                  </ExtendedField>
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
            <p>Already have an account?</p>
            <a
              href="/sign-in"
              className="underline text-red-500/70 hover:text-red-500"
            >
              sign in
            </a>{" "}
            instead.
          </div>
        </div>
      </div>
    </div>
  );
}
