import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { getUserSession } from "./auth.api"
import { checkUsernameTaken, getFullProfile, listUsers, listUsersAdmin } from "./user.api";
import { getMembersByTeam, getProject, getRole, getRolesByProject, getRolesByUser, getTeam, listProjects, listRoles, listTeams } from "./team.api";

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
      queryKey: [...authQueries.all, "profile", username],
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
  get: (name: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "get", name],
      queryFn: () => getTeam({ data: { name } }),
      staleTime: 5000,
    }),
  getMembers: (name: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "get-members", name],
      queryFn: () => getMembersByTeam({ data: { name } }),
      staleTime: 5000,
    }),
  listProjects: () =>
    queryOptions({
      queryKey: [...teamQueries.all, "projects", "list"],
      queryFn: () => listProjects(),
      staleTime: 5000,
    }),
  getProject: (acronym: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "project", "get", acronym],
      queryFn: () => getProject({ data: { acronym } }),
      staleTime: 5000,
    }),
  getRolesByProject: (id: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "roles-by-project", "get", id],
      queryFn: () => getRolesByProject({ data: { id } }),
      staleTime: 5000,
    }),
  getRolesByUser: (id: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "roles-by-user", "get", id],
      queryFn: () => getRolesByUser({ data: { id } }),
      staleTime: 5000,
    }),
  getRole: (id: string) =>
    queryOptions({
      queryKey: [...teamQueries.all, "role", "get", id],
      queryFn: () => getRole({ data: { id } }),
      staleTime: 5000,
    }),
  listRoles: () =>
    queryOptions({
      queryKey: [...teamQueries.all, "roles", "list"],
      queryFn: () => listRoles(),
      staleTime: 5000,
    }),
}