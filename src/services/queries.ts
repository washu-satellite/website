import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { getUserSession } from "./auth.api"
import { checkUsernameTaken, getFullProfile, listUsers, listUsersAdmin } from "./user.api";
import { listTeams } from "./team.api";

export const authQueries = {
  all: ["auth"],
  user: () =>
    queryOptions({
      queryKey: [...authQueries.all, "user"],
      queryFn: () => getUserSession(),
      staleTime: 5000,
    }),
  profile: (username: string) =>
    queryOptions({
      queryKey: [...authQueries.all, "profile"],
      queryFn: () => getFullProfile({ data: { username } })
    })
};

export const userQueries = {
  all: ["user"],
  list: () =>
    queryOptions({
      queryKey: [...userQueries.all, "list"],
      queryFn: () => listUsers(),
      staleTime: 5000,
    }),
  listAdmin: () =>
    queryOptions({
      queryKey: [...userQueries.all, "list-admin"],
      queryFn: () => listUsersAdmin(),
      staleTime: 5000,
    }),
}

export const teamQueries = {
  all: ["team"],
  list: () =>
    queryOptions({
      queryKey: [...teamQueries.all, "list"],
      queryFn: () => listTeams(),
      staleTime: 5000,
    }),
}