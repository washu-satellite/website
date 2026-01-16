import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExecMembers } from '@/const/content/team';
import { cn } from '@/lib/utils';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { BookUp, Check, ChevronDown, House, Pencil, Rocket, Trash, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Timeline, TimelineDate, TimelineIcon, TimelineContent, TimelineEntry } from '@/components/Timeline';
import { MEMBERSHIP_STATUS_OPTIONS, Profile, ProfileSchema } from '@/services/auth.schema';
import { deleteUser, getFullProfile, updateProfile } from '@/services/user.api';
import { useAuthenticatedUser } from '@/lib/auth/client';
import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { Spinner } from '@/components/ui/spinner';
import { DateSelection, DeleteUser, ExtendedField, ExtendedLabel, LinkedInField, TeamSelection, UsernameField } from '@/components/Form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type LoaderData = {
  profile: Awaited<ReturnType<typeof getFullProfile>>
}

export const Route = createFileRoute('/team/people/$user_slug')({
  loader: async ({ params }) => {
    const profile = await getFullProfile({
      data: {
        username: params.user_slug
      }
    });

    return { profile };
  },
  component: RouteComponent,
  staleTime: 1000 * 60
});

function DividerHeading(props: React.PropsWithChildren<{
  index: number
}>) {
  return (
    <h2 className="relative bg-background text-foreground/40 dark:bg-background/0 shadow-sm dark:shadow-none w-screen border-y border-secondary ml-0 md:-ml-8 lg:-ml-16 text-center py-4 font-mono font-light text-5xl z-10 uppercase">
      {props.children}
      <span className="absolute left-0 text-foreground/20 bg-deep-background/20 backdrop-blur-lg">0{props.index}</span>
    </h2>
  );
}

function RouteComponent() {
  const session = useAuthenticatedUser();

  const queryClient = useQueryClient();

  const params = Route.useParams();

  const { profile } = Route.useLoaderData();

  const [editMode, setEditMode] = useState(false);

  const [waiting, setWaiting] = useState(false);

  const updateProfileMutation = useMutation({
    mutationKey: ["user", "update-profile"],
    mutationFn: updateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log("successfully updated user!");
    }
  });

  const form = useForm({
    defaultValues: {
      id: profile?.id,
      name: profile?.name,
      username: profile?.username,
      memberSince: profile?.memberSince,
      membershipStatus: profile?.membershipStatus,
      email: profile?.email,
      linkedIn: profile?.linkedIn,
      fccCallsign: profile?.fcc_callsign,
      bio: profile?.bio??"",
      teamId: profile?.teamId
    } as Profile,
    validators: {
      onSubmit: ProfileSchema
    },
    onSubmit: async ({ value }) => {
      setWaiting(true);

      await updateProfileMutation.mutateAsync({ data: value });

      setWaiting(false);

      setEditMode(false);
    }
  });

  const isAdmin = session?.user.role === "admin";

  if (!profile) return (
    <div className="h-screen flex flex-col justify-center items-center text-center gap-4">
      <h1 className="text-lg">There is no user with id <Badge variant='outline' className="font-mono text-base font-semibold rounded-md">{params.user_slug}</Badge></h1>
      <Button asChild variant='outline'>
        <Link to="/" className="flex flex-row items-center">
          <House />
          Return home
        </Link>
      </Button>
    </div>
  )

  return (
    <div className={"flex-1 overflow-x-hidden z-10"}>
      <main>
        <div className="w-full h-[10rem] md:h-[12rem] overflow-hidden">
          <img
            src="/space_bg.png"
            className="size-full object-cover"
          />
        </div>
        <div className={cn(
          `relative border-t border-border bg-deep-background`
        )}>
          <div
            className="flex flex-col px-2 md:px-4 lg:px-[4rem] gap-8 relative border-b"
          >
            <div className="border-border md:border-x">
              <div
                style={{ backgroundImage: `url("/dots.svg")`, backgroundSize: "100px", backgroundPositionX: 0 }}
                className="hidden dark:block absolute -z-10 left-0 top-0 w-[10rem] opacity-60 h-full bg-repeat-y"
              />
              <div className="w-full block md:flex flex-row border-t border-border">
                <div className="w-full md:w-1/3 xl:w-1/6 relative border-r border-border flex flex-col items-center justify-center bg-[repeating-linear-gradient(45deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.secondary)]">
                  <Avatar className="rounded-none bg-transparent w-48 h-48 py-4 md:py-0">
                      <AvatarImage src={undefined} alt="u" />
                      <AvatarFallback className="rounded-none bg-transparent">
                          <User className="w-16 h-16 text-foreground/80"/>
                      </AvatarFallback>
                  </Avatar>
                  <p className="absolute bottom-2 right-2 font-mono text-xs uppercase text-foreground/60">Photo</p>
                </div>
                <div className="w-full md:w-2/3 xl:w-5/6 text-foreground/90">
                  <form
                    id="profile-form"
                    onSubmit={(e) => {
                      e.preventDefault()
                      form.handleSubmit()
                    }}
                  >
                    <FieldGroup className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
                      {/* <form.Field
                        name="name"
                        children={(field) => {  
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <ExtendedField isInvalid={isInvalid}>
                              <ExtendedLabel
                                name={field.name}
                                badge={(
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <CircleQuestionMark className="w-3 h-3"/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Must be an active position, or the highest position during tenure
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              >
                                Position
                              </ExtendedLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                aria-invalid={isInvalid}
                                placeholder={"position"}
                              />
                            </ExtendedField>
                          )
                        }}
                      /> */}

                      <form.Field
                        name="name"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <ExtendedField isInvalid={isInvalid} field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                Name
                              </ExtendedLabel>
                              {editMode ? (
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  aria-invalid={isInvalid}
                                  placeholder={"John Smith"}
                                />
                              ) : (
                                <p>{field.state.value}</p>
                              )}
                            </ExtendedField>
                          )
                        }}
                      />

                      {editMode ? (
                        <UsernameField
                          horizontal
                          form={form}
                        />
                      ) : (
                        <form.Field
                          name="username"
                          children={(field) => {  
                            const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                            return (
                              <ExtendedField isInvalid={isInvalid} field={field}>
                                <ExtendedLabel
                                  name={field.name}
                                >
                                  Username
                                </ExtendedLabel>
                                <p>@{field.state.value}</p>
                              </ExtendedField>
                            )
                          }}
                        />
                      )}

                      <form.Field
                        name="teamId"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <ExtendedField isInvalid={isInvalid} field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                Subteam
                              </ExtendedLabel>
                              {editMode && isAdmin ? (
                                <TeamSelection field={field} isInvalid={isInvalid}/>
                              ) : (
                                <p>{field.state.value}</p>
                              )}
                            </ExtendedField>
                          )
                        }}
                      />

                      <form.Field
                        name="memberSince"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <ExtendedField isInvalid={isInvalid} field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                Member Since
                              </ExtendedLabel>
                              {editMode && isAdmin ? (
                                <DateSelection field={field}/>
                              ) : (
                                <p>{new Intl.DateTimeFormat('en-US').format(field.state.value)}</p>
                              )}
                            </ExtendedField>
                          )
                        }}
                      />

                      <form.Field
                        name="membershipStatus"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return (
                            <ExtendedField isInvalid={isInvalid} field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                Membership Status
                              </ExtendedLabel>
                              {editMode && isAdmin ? (
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
                              ) : (
                                <p className="text-red-400/80">{field.state.value}</p>
                              )}
                            </ExtendedField>
                          )
                        }}
                      />

                      <form.Field
                        name="linkedIn"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return field.state.value || editMode ? (
                            <ExtendedField isInvalid={isInvalid} field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                LinkedIn
                              </ExtendedLabel>
                              {editMode ? (
                                <LinkedInField
                                  field={field}
                                  isInvalid={isInvalid}
                                />
                              ) : (
                                <a
                                  href={`https://www.linkedin.com/in/${field.state.value}`}
                                  className="hover:underline underline-offset-2"
                                >
                                  linkedin.com/in/{field.state.value}
                                </a>
                              )}
                            </ExtendedField>
                          ) : <></>;
                        }}
                      />

                      <form.Field
                        name="bio"
                        children={(field) => {  
                          const isInvalid = editMode && field.state.meta.isTouched && !field.state.meta.isValid;

                          return field.state.value || editMode ? (
                            <ExtendedField isInvalid={isInvalid} className="col-span-full" field={field}>
                              <ExtendedLabel
                                name={field.name}
                              >
                                Bio
                              </ExtendedLabel>
                              {editMode ? (
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
                              ) : (
                                <p className="text-sm">{field.state.value}</p>
                              )}
                            </ExtendedField>
                          ) : <></>;
                        }}
                      />
                    </FieldGroup>
                  </form>
                  {/* <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 space-y-4 space-x-4">
                    <div>
                      <div className="flex flex-row items-center gap-2">
                        <p className="font-mono text-xs uppercase text-foreground/80">Email</p>
                        <Tooltip>
                          <TooltipTrigger>
                            <Star className="w-3 h-3"/>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.name.split(" ")[0]} set this as their preferred contact method
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="hover:underline underline-offset-2">{user.email}</p>
                    </div>
                  </div> */}
                  {(session?.profile.username === params.user_slug || session?.user.role === "admin") &&
                    <div className="col-span-full flex flex-row items-center gap-2 border-t border-border p-4">
                      {editMode ? (
                        <>
                          <Button
                            type='submit'
                            form='profile-form'
                            variant='default'
                            className="flex flex-row items-center"
                          >
                            {waiting ? (
                              <Spinner />
                            ) : (
                              <Check className="w-4 h-4"/>
                            )}
                            Confirm changes
                          </Button>

                          <Button
                            type='button'
                            variant='outline'
                            className="flex flex-row items-center"
                            onClick={() => {
                              form.reset();
                              setEditMode(false);
                            }}
                          >
                            <X className="w-4 h-4"/>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant='outline'
                          className="flex flex-row items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditMode(true);
                          }}
                        >
                          <Pencil className="w-4 h-4"/>
                          Edit information
                        </Button>
                      )}
                      {session?.user.role === "admin" &&
                        <DeleteUser username={profile.username}>
                          <Button
                            variant='destructive'
                            className="flex flex-row items-center !bg-red-500/50 !hover:bg-red-500"
                          >
                            <Trash className="w-4 h-4"/>
                            Delete user
                          </Button>
                        </DeleteUser>
                      }
                    </div>
                  }
                </div>
              </div>
              {/* <DividerHeading index={1}>
                History
              </DividerHeading>
              
              <Timeline>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <Rocket className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
                <TimelineEntry>
                  <TimelineDate>
                    Spring 2024
                  </TimelineDate>
                  <TimelineIcon>
                    <BookUp className="w-6 h-6"/>
                  </TimelineIcon>
                  <TimelineContent>
                    <h5>Getting started</h5>
                    <p className="text-sm text-foreground/80">Nate joined the team as a Software Engineer</p>
                  </TimelineContent>
                </TimelineEntry>
              </Timeline> */}

              {/* <DividerHeading index={1}>
                Positions
              </DividerHeading> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
