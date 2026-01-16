import { cn } from "@/lib/utils";
import React, { ReactNode, useState } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  AtSign,
  CheckIcon,
  ChevronDownIcon,
  CircleQuestionMarkIcon,
  LockIcon,
  XIcon,
} from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { checkUsernameTaken } from "@/services/user.api";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuthenticatedUser } from "@/lib/auth/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "@/services/user.api";

export function ExtendedField(
  props: React.PropsWithChildren<
    {
      isInvalid: boolean;
      field: any;
      locked?: boolean;
    } & React.ComponentProps<"div">
  >
) {
  return (
    <Field
      data-invalid={props.isInvalid}
      className={cn("gap-1", props.className)}
      aria-disabled={props.locked}
    >
      {props.children}
      {props.isInvalid && (
        <FieldError
          errors={props.field.state.meta.errors}
          className="text-xs"
        />
      )}
    </Field>
  );
}

export function ExtendedLabel(
  props: React.PropsWithChildren<{
    name: string;
    badge?: ReactNode;
    locked?: boolean;
    horizontal?: boolean;
  }>
) {
  return (
    <div
      className={cn("flex flex-row items-center gap-2", {
        "mb-1": !props.horizontal,
      })}
    >
      {props.locked && <LockIcon className="w-3 text-foreground/60" />}
      <FieldLabel htmlFor={props.name}>
        <p className="font-mono text-xs uppercase text-foreground/60">
          {props.children}
        </p>
      </FieldLabel>
      {props.badge}
    </div>
  );
}

export function DateSelection(props: { field: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={props.field.name}
          className="w-full justify-between font-normal"
        >
          {props.field.state.value
            ? props.field.state.value.toLocaleString()
            : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-border">
        <Calendar
          mode="single"
          selected={props.field.state.value}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return setOpen(false);

            props.field.setValue(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function LinkedInField(
  props: {
    field: any;
    isInvalid?: boolean;
  } & React.ComponentProps<"div">
) {
  return (
    <InputGroup>
      <InputGroupInput
        id={props.field.name}
        name={props.field.name}
        value={props.field.state.value}
        onBlur={props.field.handleBlur}
        onChange={(e) => props.field.handleChange(e.target.value)}
        aria-invalid={props.isInvalid}
        placeholder={"j_smith"}
      />
      <InputGroupAddon>
        <p>https://www.linkedin.com/in/</p>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function UsernameField(
  props: {
    form: any;
    locked?: boolean;
    horizontal?: boolean;
  } & React.ComponentProps<"div">
) {
  const [nameTaken, setNameTaken] = useState<"not_checked" | "free" | "taken">(
    "not_checked"
  );
  const [waiting, setWaiting] = useState(false);

  const user = useAuthenticatedUser();

  const nameInvalid = (username: string) => {
    return nameTaken === "taken" && user?.profile.username !== username;
  }

  return (
    <props.form.Field
      name="username"
      validators={{
        onBlurAsync: async ({ value }: { value: string }) => {
          console.log("onBlur triggered!");

          setWaiting(true);

          const taken = await checkUsernameTaken({ data: { username: value } });

          setNameTaken(taken ? "taken" : "free");

          setWaiting(false);
        },
      }}
      children={(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field
            data-invalid={isInvalid || nameInvalid(field.state.value)}
            className={cn("gap-1", props.className, {
              "-mt-1": props.horizontal,
            })}
          >
            <ExtendedLabel
              name={field.name}
              horizontal={props.horizontal}
              badge={
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMarkIcon className="w-3.5 text-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Username acts as a unique identifier of this user
                  </TooltipContent>
                </Tooltip>
              }
              locked={props.locked}
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
                aria-invalid={isInvalid || nameInvalid(field.state.value)}
                aria-disabled={props.locked}
                disabled={props.locked}
                placeholder={"j_smith"}
              />
              <InputGroupAddon>
                {waiting ? <Spinner /> : <AtSign />}
              </InputGroupAddon>
            </InputGroup>
            {isInvalid ? (
              <FieldError
                errors={field.state.meta.errors}
                className="text-xs"
              />
            ) : (
              nameTaken !== "not_checked" &&
              (!nameInvalid(field.state.value) ? (
                <p className="text-green-500 flex flex-row items-center text-xs gap-1">
                  <CheckIcon className="w-4" />
                  Name is available
                </p>
              ) : (
                <p className="text-destructive flex flex-row items-center text-xs gap-1">
                  <XIcon className="w-4" />
                  Name is taken
                </p>
              ))
            )}
          </Field>
        );
      }}
    />
  );
}

export function DeleteUser(
  props: React.PropsWithChildren<{
    username: string;
  }>
) {
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationKey: ["user", "delete-user"],
    mutationFn: deleteUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("successfully deleted user!");
    },
  });

  const [deleteAlert, setDeleteAlert] = React.useState(false);

  return (
    <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
      <AlertDialogTrigger
        asChild
        onClick={(e) => {
          e.preventDefault();
          setDeleteAlert(true);
        }}
      >
        {props.children}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border">
        <AlertDialogHeader>Are you sure?</AlertDialogHeader>
        <AlertDialogDescription>
          You are about to permanently remove a user. This action cannot be
          undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteUserMutation.mutateAsync({
                data: { username: props.username },
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
