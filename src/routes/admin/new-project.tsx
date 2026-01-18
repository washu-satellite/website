import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject } from '@/services/team.api';
import { Project, ProjectSchema } from '@/services/team.schema';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { DropdownSelect, ExtendedField, ExtendedLabel } from '@/components/Form';
import { FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { teamQueries } from '@/services/queries';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { projectIconEnum } from '@/lib/db/schema';

export const Route = createFileRoute('/admin/new-project')({
  component: RouteComponent,
});

export function ProjectSelection(
  props: {
    field: any;
    isInvalid?: boolean;
  } & React.ComponentProps<"div">
) {
  const { data } = useQuery(teamQueries.list());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className="w-full justify-between">
          {props.field.state.value??"None"}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {data?.map(t => (
            <DropdownMenuItem
              onClick={() => props.field.handleChange(t.name)}
            >
              {t.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProjectForm(props: {
  title: string,
  defaults?: Project,
  onSubmit: (data: { value: Project }) => Promise<void>
}) {
  const [waiting, setWaiting] = useState(false);

  const form = useForm({
    defaultValues: props.defaults??{
      id: "",
      name: "",
      icon: "empty"
    } as Project,
    validators: {
      onSubmit: ProjectSchema,
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
            id="new-user-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            <h1 className="text-center uppercase font-mono text-lg mb-4">New Project</h1>
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
                name="acronym"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Acronym
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
                name="icon"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Icon
                      </ExtendedLabel>
                      <DropdownSelect field={field} isInvalid={isInvalid} options={projectIconEnum.enumValues}/>
                    </ExtendedField>
                  );
                }}
              />

              <form.Field
                name="description"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} className="col-span-full" field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Description
                      </ExtendedLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value??""}
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

              <form.Field
                name="descriptionShort"
                children={(field) => {  
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <ExtendedField isInvalid={isInvalid} className="col-span-full" field={field}>
                      <ExtendedLabel
                        name={field.name}
                      >
                        Short Description (Blurb)
                      </ExtendedLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value??""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        <InputGroupAddon align='block-end'>
                          <InputGroupText className="tabular-nums">
                            {field.state.value?.length??0}/200 characters
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

function RouteComponent() {
  const navigate = useNavigate();
  
  const { redirect: redirectTo } = Route.useSearch();

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationKey: ["team", "create-role"],
    mutationFn: createProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      navigate({ to: redirectTo || "/team" });
    },
  });

  return (
    <ProjectForm
      title="New Subteam"
      onSubmit={async ({ value }) => {
        await createProjectMutation.mutateAsync({ data: value });
      }}
    />
  );
}
