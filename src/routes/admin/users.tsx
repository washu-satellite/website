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
    useQueryClient
} from "@tanstack/react-query"

import { deleteUser, listUsersAdmin } from "@/services/user.api"
import { authQueries, userQueries } from "@/services/queries"
import { isAdmin } from "@/util/auth"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { FieldGroup } from "@/components/ui/field"
import LoadingPage from "@/components/LoadingPage"

export const Route = createFileRoute('/admin/users')({
    beforeLoad: async ({ context }) => {
        const userSession = await context.queryClient.ensureQueryData(
            authQueries.user()
        );

        if (!isAdmin(userSession))
            throw redirect({
            to: '/sign-in',
        })
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
    const queryClient = useQueryClient();

    const deleteUserMutation = useMutation({
        mutationKey: ["user", "delete-user"],
        mutationFn: deleteUser,
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['user'] });
          console.log("successfully deleted user!");
        }
      });
    
    const [deleteAlert, setDeleteAlert] = React.useState(false);
    
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
                    <Link to={`/team/${props.userData.username}`} className="flex flex-row items-center">
                        <ExternalLink />
                        View profile
                    </Link>
                </DropdownMenuItem>
                <AlertDialog open={deleteAlert} onOpenChange={setDeleteAlert}>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="flex flex-row items-center text-destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                setDeleteAlert(true);
                            }}
                        >
                            <TrashIcon className="text-destructive"/>
                            Delete user
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-border">
                        <AlertDialogHeader>
                            Are you sure?
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            You are about to permanently remove a user. This action cannot be undone.
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    await deleteUserMutation.mutateAsync({ data: { username: props.userData.username } });
                                }}
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
        header: "id",
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
                    Upload a user CSV
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Converts the uploaded CSV rows into new (unclaimed) user profile entries. Must contain at least the columns <span className="font-mono">name</span> and <span className="font-mono">email</span>. Other columns may be provided, but will be nulled or automatically created based on the name/email. Duplicate users (by email) are ignored.
                </AlertDialogDescription>
                <form
                    id="csv-upload-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <FieldGroup>
                        <Input
                            id="csv-file"
                            type="file"
                            accept=".csv"
                            className="text-base text-foreground/80"
                        />
                    </FieldGroup>
                </form>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button>
                            Submit
                        </Button>
                    </AlertDialogAction>
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

    if (!users) return <LoadingPage />;

    const table = useReactTable({
        data: users,
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
