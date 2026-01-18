import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, AtSignIcon, CheckIcon, ChevronDown, ClipboardIcon, ExternalLink, MoreHorizontal, PlusIcon, TrashIcon, Upload, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"

import { deleteUser, listUsersAdmin } from "@/services/user.api"
import { authQueries, userQueries } from "@/services/queries"
import { isAdmin } from "@/util/auth"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FieldGroup } from "@/components/ui/field"
import LoadingPage from "@/components/LoadingPage"
import { DeleteUser } from "@/components/Form"
import Papa, { ParseResult } from "papaparse";
import { Spinner } from "@/components/ui/spinner"
import { batchCreateProfile } from "@/services/auth.api"
import z, { email, success, ZodError } from "zod"
import { MEMBERSHIP_STATUS_OPTIONS, NewProfileSchema, Profile, ProfileSchema } from "@/services/auth.schema"

export const Route = createFileRoute('/admin/users')({
    beforeLoad: async ({ context }) => {
        const { userSession } = context;

        if (!isAdmin(userSession))
            throw redirect({
            to: '/sign-in',
        });
    },
    loader: ({ params, context }) => {
        return context.queryClient.ensureQueryData(userQueries.listAdmin());
    },
  component: RouteComponent,
});

type Column = Awaited<ReturnType<typeof listUsersAdmin>>[number];

function UserRowActions(props: {
    userData: Column
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border text-foreground/80">
                <DropdownMenuLabel className="text-foreground">Actions</DropdownMenuLabel>
                {props.userData.userId &&
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(props.userData.userId!)}
                        className="flex flex-row items-center"
                    >
                        <ClipboardIcon />
                        Copy ID
                    </DropdownMenuItem>
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    asChild
                >
                    <Link to={"/team/people/$user_slug"} params={{ user_slug: props.userData.username }} className="flex flex-row items-center">
                        <ExternalLink />
                        View profile
                    </Link>
                </DropdownMenuItem>
                <DeleteUser username={props.userData.username}>
                    <DropdownMenuItem
                        className="flex flex-row items-center text-destructive"
                    >
                        <TrashIcon className="text-destructive"/>
                        Delete user
                    </DropdownMenuItem>
                </DeleteUser>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<Column>[] = [
    {
        id: "select",
        header: ({ table }) => (
        <Checkbox
            checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
        ),
        cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "hasAccount",
        header: "has account",
        cell: ({ row }) => row.getValue("userId") ? (
            <CheckIcon className="text-green-500 w-4"/>
        ) : (
            <XIcon className="text-destructive w-4"/>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "fccCallsign",
        header: "fcc callsign",
        cell: ({ row }) => row.getValue("fccCallsign"),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "membershipStatus",
        header: "membership status",
        cell: ({ row }) => row.getValue("membershipStatus"),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "linkedIn",
        header: "linkedin",
        cell: ({ row }) => row.getValue("linkedIn"),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting()}
                className={cn(
                    "-ml-3",
                    {
                        "underline underline-offset-2": column.getIsSorted()
                    }
                )}
            >
                name
                {column.getIsSorted() ? (
                    column.getIsSorted() === "asc" ? (
                        <ArrowUp />
                    ) : (
                        <ArrowDown />
                    )
                ) : (
                    <ArrowUpDown />
                )}
            </Button>
        ),
        cell: ({ row }) => (
            row.getValue("name")
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "username",
        header: "username",
        cell: ({ row }) => (
            <div className="flex flex-row items-center gap-1">
                <AtSignIcon className="w-4"/>
                {row.getValue("username")}
            </div>
        ),
        enableHiding: true,
    },
    {
        accessorKey: "email",
        header: "email",
        cell: ({ row }) => (
            row.getValue("email")
        ),
        enableHiding: true,
    },
    {
        accessorKey: "memberSince",
        header: "member since",
        cell: ({ row }) => (
            (row.getValue("memberSince") as Date).toLocaleDateString("en-us")
        ),
        enableHiding: true,
    },
    {
        accessorKey: "userId",
        header: "account id",
        cell: ({ row }) => (
            <p
                className="line-clamp-1"
            >
                {row.getValue("userId")}
            </p>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const userData = row.original;
            return (
                <UserRowActions userData={userData}/>
            );
        },
    },
];

function FileUpload() {
    const [open, setOpen] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);
    const [waiting, setWaiting] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

    const queryClient = useQueryClient();

    const publishUsersMutation = useMutation({
        mutationKey: ["auth", "sign-up"],
        mutationFn: batchCreateProfile,
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (err) => {
          setErrorMessages([err.message]);
    
          setWaiting(false);
        }
      });

    const publishData = async (f: File) => {
        const results = await new Promise((complete, error) => {
                Papa.parse(f, {
                    complete,
                    error,
                    header: true
                });
        }) as { data: any, errors: string[] };

        if (results.errors.length > 0) {
            console.log(results.errors);
            setErrorMessages(results.errors.map(e => JSON.stringify(e)));
            return false;
        }

        const filtered = results.data.map((d: any) => {
            return {
                ...d,
                username: ((d.name??"") as string).toLowerCase().replaceAll(" ", "_").replaceAll("-", "_").replaceAll(".", "_").slice(0, 16),
                memberSince: new Date(),
                membershipStatus: d.membershipStatus??MEMBERSHIP_STATUS_OPTIONS[0]
            };
        });

        const val = ProfileSchema.safeParse(filtered[0]);
        if (val.error) {
            console.log(val.error);
            setErrorMessages(val.error.issues.map(i => `"${i.path[i.path.length-1].toString()}": ${i.message}`));
            return false;
        }

        const safeVals = filtered
            .map((row: any) => ProfileSchema.safeParse(row))
            .filter((row: any) => row.success)
            .map((row: any) => row.data);

        await publishUsersMutation.mutateAsync({ data: { profiles: safeVals } });

        return true;
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant='outline' onClick={() => setOpen(true)}>
                    <Upload />
                    Upload CSV
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Upload a user CSV
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Converts the uploaded CSV rows into new (unclaimed) user profile entries. Must contain at least the columns <span className="font-mono">name</span> and <span className="font-mono">email</span>. Other columns may be provided, but will be nulled or automatically created based on the name/email. Duplicate users (by email) are ignored.
                </AlertDialogDescription>
                <form
                    id="csv-upload-form"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        setErrorMessages([]);

                        if (!file)
                            return;
                        
                        setWaiting(true);

                        const success = await publishData(file);

                        setWaiting(false);

                        if (errorMessages.length === 0 && success) {
                            setOpen(false);
                        }
                    }}
                >
                    <FieldGroup>
                        <Input
                            id="csv-file"
                            type="file"
                            accept=".csv"
                            className="text-base text-foreground/80"
                            onChange={(e) => setFile(e.target.files?.[0]??null)}
                        />
                    </FieldGroup>
                    {errorMessages.length > 0 &&
                        <ul className="text-destructive text-sm pt-2">
                            {errorMessages.map(m => (
                                <li className="flex flex-row items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-destructive"/>{m}</li>
                            ))}
                        </ul>
                    }
                </form>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        type="submit"
                        form="csv-upload-form"
                    >
                        {waiting &&
                            <Spinner />
                        }
                        Submit
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function RouteComponent() {
   const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const { data: users } = useQuery(userQueries.listAdmin());

    const table = useReactTable({
        data: users??[],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 12
            }
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    if (!users) return <LoadingPage />;

    return (
        <div className="flex-1 w-full mt-20 px-8">
            <div className="flex items-center pb-4">
                <Input
                    placeholder="Filter by..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center gap-2 ml-auto">
                    <Button variant='outline' asChild>
                        <Link to="/admin/new-user" className="flex flex-row items-center">
                            <PlusIcon />
                            New user
                        </Link>
                    </Button>
                    <FileUpload />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Fields <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-border">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => {
                                        table
                                            .getAllColumns()
                                            .filter(c => c.getCanHide())
                                            .forEach(c => {
                                            c.toggleVisibility(false);
                                        })
                                    }}
                                >
                                    Hide all
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        table
                                            .getAllColumns()
                                            .filter(c => c.getCanHide())
                                            .forEach(c => {
                                            c.toggleVisibility(true);
                                        })
                                    }}
                                >
                                    Show all
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border border-border">
                <Table className="bg-secondary/30">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-border"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="border-border">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-border"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-foreground/80">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} users(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
