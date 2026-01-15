import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { AtSign, CheckIcon, ChevronDownIcon, CircleQuestionMarkIcon, LockIcon, XIcon } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { checkUsernameTaken } from "@/services/user.api";
import { Spinner } from "./ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuthenticatedUser } from "@/lib/auth/client";

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
  }>
) {
  return (
    <div className="flex flex-row items-center gap-2 mb-1">
      {props.locked &&
        <LockIcon className="w-3 text-foreground/60"/>
      }
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

export function UsernameField(
  props: {
    form: any,
    locked?: boolean
  } & React.ComponentProps<"div">
) {
  const [nameTaken, setNameTaken] = useState<"not_checked" | "free" | "taken">(
    "not_checked"
  );
  const [waiting, setWaiting] = useState(false);

  const user = useAuthenticatedUser();

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
            data-invalid={isInvalid || nameTaken === "taken"}
            className={cn("gap-1", props.className)}
          >
            <ExtendedLabel name={field.name} badge={
              <Tooltip>
                <TooltipTrigger>
                  <CircleQuestionMarkIcon className="w-3.5 text-foreground/60" />
                </TooltipTrigger>
                <TooltipContent>
                  Username acts as a unique identifier of this user
                </TooltipContent>
              </Tooltip>
            } locked={props.locked}>Username</ExtendedLabel>
            <InputGroup>
              <InputGroupInput
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid || nameTaken === "taken"}
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
              (nameTaken === "free" ? (
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
