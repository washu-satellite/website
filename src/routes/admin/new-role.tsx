import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ShuffleIcon } from 'lucide-react';
import { faker } from "@faker-js/faker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRole, createTeam } from '@/services/team.api';
import { Role, RoleSchema, Team, TeamSchema } from '@/services/team.schema';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { DropdownSelect, ExtendedField, ExtendedLabel, ProjectSelection, RoleSelection, UsernameReferenceField } from '@/components/Form';
import { FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { teamQueries } from '@/services/queries';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getFullProfile } from '@/services/user.api';
import z, { ZodObject } from 'zod';
import { $ZodType, $ZodTypeInternals } from 'better-auth';

export const Route = createFileRoute('/admin/new-role')({
  component: RouteComponent,
});

export function RoleForm(props: {
  title: string,
  defaults?: Role,
  onSubmit: (data: { value: Role }) => Promise<void>
}) {
  const [waiting, setWaiting] = useState(false);

  const form = useForm({
    defaultValues: props.defaults??{
      id: "",
      name: ""
    } as Role,
    validators: {
      onSubmit: RoleSchema,
    },
    onSubmit: async ({ value }) => {
      setWaiting(true);

      await props.onSubmit({ value });

      setWaiting(false);
    },
  });

  return (
    <div className="flex-1 h-screen flex flex-col justify-center items-center mt-20 pb-8">
      <div className="relative flex-1 flex flex-col gap-4 p-4 px-8 max-w-[48rem] w-full h-fit grow-0 border border-border rounded-md">
        <div className="w-full">
          <form
            id="role-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            <h1 className="text-center uppercase font-mono text-lg mb-4">{props.title}</h1>
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
                      />
                    </ExtendedField>
                  );
                }}
              />

              <form.Field
                name="rank"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Relative Rank
                      </ExtendedLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        aria-invalid={isInvalid}
                      />
                    </ExtendedField>
                  );
                }}
              />

              <form.Field
                name="projectId"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Project
                      </ExtendedLabel>
                      <ProjectSelection field={field} isInvalid={isInvalid}/>
                    </ExtendedField>
                  );
                }}
              />

              <form.Field
                name="reportsTo"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Reports To
                      </ExtendedLabel>
                      <RoleSelection field={field} isInvalid={isInvalid}/>
                    </ExtendedField>
                  );
                }}
              />

              <UsernameReferenceField
                form={form}
                customLabel={"Assignee"}
              />
            </FieldGroup>
          </form>
        </div>
        <div className="flex flex-row gap-4 items-center justify-between">
          <Button
            type="submit"
            form="role-form"
            className="cursor-pointer flex flex-row items-center"
            disabled={waiting}
          >
            {waiting && <Spinner />}
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function RouteComponent() {
    const navigate = useNavigate();
    
    const { redirect: redirectTo } = Route.useSearch();
  
    const queryClient = useQueryClient();
  
    const createRoleMutation = useMutation({
      mutationKey: ["team", "create-role"],
      mutationFn: createRole,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["team"] });
        navigate({ to: redirectTo || "/team" });
      },
    });
  
    return (
      <RoleForm
        title="New Role"
        onSubmit={async ({ value }) => {
          if (value.username) {
            console.log(value.userId);

            const profile = await getFullProfile({ data: { username: value.username } })

            console.log(profile);

            value.userId = profile?.userId;
          }

          console.log(value);
    
          await createRoleMutation.mutateAsync({ data: value });
        }}
      />
    );
}
