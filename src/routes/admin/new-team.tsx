import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ShuffleIcon } from 'lucide-react';
import { faker } from "@faker-js/faker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from '@/services/team.api';
import { Team, TeamSchema } from '@/services/team.schema';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { ExtendedField, ExtendedLabel } from '@/components/Form';
import { FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/admin/new-team')({
  component: RouteComponent,
})

function RouteComponent() {
  const [waiting, setWaiting] = useState(false);

  const navigate = useNavigate();
  
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const createTeamMutation = useMutation({
    mutationKey: ["team", "create-team"],
    mutationFn: createTeam,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  const form = useForm({
    defaultValues: {
      id: "",
      name: ""
    } as Team,
    validators: {
      onSubmit: TeamSchema,
    },
    onSubmit: async ({ value }) => {
      setWaiting(true);

      await createTeamMutation.mutateAsync({ data: value });

      setWaiting(false);
    },
  });

  return (
    <div className="flex-1 h-screen flex flex-col justify-center items-center mt-20 pb-8">
      <div className="relative flex-1 flex flex-col gap-4 p-4 px-8 max-w-[24rem] w-full h-fit grow-0 border border-border rounded-md">
        <div className="w-full">
          <form
            id="new-user-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            <h1 className="text-center uppercase font-mono text-lg mb-4">New Team</h1>
            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2">

              <form.Field
                name="name"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} className="col-span-full" field={field}>
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