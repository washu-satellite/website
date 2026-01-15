import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronDown, ShuffleIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MEMBERSHIP_STATUS_OPTIONS, Profile, ProfileSchema } from '@/services/auth.schema';
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { Spinner } from '@/components/ui/spinner';
import { createProfileAdmin } from '@/services/auth.api';
import { DateSelection, ExtendedField, ExtendedLabel, UsernameField } from '@/components/Form';
import { faker } from "@faker-js/faker";


export const Route = createFileRoute("/admin/new-user")({
  component: RouteComponent,
});

async function triggerCreateProfile(data: Profile) {
  createProfileAdmin({ data });
}

function RouteComponent() {
  const [waiting, setWaiting] = useState(false);

  const form = useForm({
    defaultValues: {
      userId: undefined,
      name: "",
      username: "",
      memberSince: new Date(),
      email: "",
      membershipStatus: "Unknown",
      linkedin: undefined,
      fccCallsign: undefined,
      bio: undefined,
      imageUrl: ""
    } as Profile,
    validators: {
      onSubmit: ProfileSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("submitting...");

      setWaiting(true);

      await createProfileMutation.mutateAsync(value);

      setWaiting(false);
    },
  });

  const navigate = useNavigate();
  
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const createProfileMutation = useMutation({
    mutationKey: ["user", "create-profile"],
    mutationFn: triggerCreateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("successfully updated user!");
      navigate({ to: redirectTo || "/admin/users" });
    },
  });

  return (
    <div className="flex-1 h-screen flex flex-col justify-center items-center mt-20 pb-8">
      <div className="relative flex-1 flex flex-col gap-4 p-4 px-8 max-w-[48rem] w-full h-fit grow-0 border border-border rounded-md">
        <Button
          variant='outline'
          className="absolute top-3 right-3"
          onClick={() => {
            form.setFieldValue("email", faker.internet.email());
            form.setFieldValue("name", faker.person.fullName());
            form.setFieldValue("username", faker.internet.username());
            form.setFieldValue("linkedin", faker.internet.url());
          }}
        >
          <ShuffleIcon />
          Randomize
        </Button>
        <div className="w-full">
          <form
            id="new-user-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            <h1 className="text-center capitalize font-mono text-lg mb-4">NEW USER</h1>
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">
              <form.Field
                name="name"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Name
                      </ExtendedLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={"John Smith"}
                      />
                    </ExtendedField>
                  )
                }}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  
                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel name={field.name}>
                        Email
                      </ExtendedLabel>
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
                    </ExtendedField>
                  )
                }}
              />

              <UsernameField
                form={form}
              />

              {/* <form.Field
                name="username"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Username
                      </ExtendedLabel>
                        <InputGroup>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={"j_smith"}
                        />
                        <InputGroupAddon>
                          <AtSign />
                        </InputGroupAddon>
                      </InputGroup>
                    </ExtendedField>
                  )
                }}
              /> */}

              <form.Field
                name="memberSince"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Member Since
                      </ExtendedLabel>
                      <DateSelection field={field}/>
                    </ExtendedField>
                  )
                }}
              />

              <form.Field
                name="membershipStatus"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Membership Status
                      </ExtendedLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-invalid={isInvalid}
                          className="flex flex-row items-center justify-between bg-input/30 border-input border px-3 py-1.5 rounded-md text-sm"
                        >
                          <p>{field.state.value}</p>
                          <ChevronDown
                              className={cn(
                                  "-ml-1 w-4 h-4 transition-all duration-300",
                                  // {
                                  //     "rotate-0": !open,
                                  //     "rotate-180": open
                                  // }
                              )}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-border">
                          <DropdownMenuGroup>
                            {MEMBERSHIP_STATUS_OPTIONS.map((m, i) => (
                              <DropdownMenuItem
                                key={i}
                                onClick={() => field.setValue(m)}
                              >
                                {m}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ExtendedField>
                  )
                }}
              />

              <form.Field
                name="linkedin"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        LinkedIn
                      </ExtendedLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                    </ExtendedField>
                  );
                }}
              />

              <form.Field
                name="bio"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} className="col-span-full" field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Bio
                      </ExtendedLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        <InputGroupAddon align='block-end'>
                          <InputGroupText className="tabular-nums">
                            {field.state.value?.length??0}/2000 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </ExtendedField>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between">
          <Button
            type="submit"
            form="new-user-form"
            className="cursor-pointer flex flex-row items-center"
            disabled={waiting}
          >
            {waiting && <Spinner />}
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
