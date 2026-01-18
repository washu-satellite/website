import GenericPage from '@/components/GenericPage'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { teamQueries } from '@/services/queries';
import { TeamTile } from '../team';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, ReactFlowProps, Handle, Position, Node, MiniMap, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Role } from '@/services/team.schema';
import { useEffect, useState } from 'react';
import { bStore } from '@/hooks/useAppStore';
import { cn } from '@/lib/utils';
import { useAuthenticatedUser } from '@/lib/auth/client';
import { Button } from '@/components/ui/button';
import { ArrowDown, ExternalLink, Pencil, Trash, X } from 'lucide-react';
import { isAdmin } from '@/util/auth';

export const Route = createFileRoute('/missions/$project_slug')({
  loader: async ({ params, context }) => {
    console.log(params.project_slug);

    const data = await context.queryClient.ensureQueryData(teamQueries.getProject(params.project_slug));

    return await context.queryClient.ensureQueryData(teamQueries.getRolesByProject(data.id??""));
  },
  component: RouteComponent,
});

export function RoleNode(props: { data: {
  name: string,
  top?: boolean,
  bottom?: boolean,
  id: string
} }) {
  const userData = useAuthenticatedUser();

  return (
    <div className="custom-node">
      {!props.data.top &&
        <Handle type="target" position={Position.Top} color="var(--border)" />
      }
      <div
        className={cn(
          "relative group bg-background border-border border rounded-md p-4 px-3 w-[12rem] text-center",
          {
            "text-sm text-foreground/80": props.data.bottom
          }
        )}
      >
        <div className="absolute hidden group-hover:flex top-0 left-0 h-full w-full flex-row items-center justify-center backdrop-blur-sm rounded-md px-2 gap-2">
          {userData?.user.role === "admin" ? (
            <>
              <Link to="/missions/roles/edit/$role_slug" params={{ role_slug: props.data.id }}>
                <Button variant='outline'>
                  <Pencil />
                  Edit
                </Button>
              </Link>
              <Button variant='outline' className="!border-destructive text-destructive hover:!bg-destructive/30 hover:!text-foreground">
                <Trash />
                Delete
              </Button>
            </>
          ) : (
            <Button variant='outline'>
              <ExternalLink />
              Details
            </Button>
          )}
        </div>
        <p>{props.data.name}</p>
      </div>
      {!props.data.bottom &&
        <Handle type="source" position={Position.Bottom} color="var(--border)" />
      }
    </div>
  );
}

export function ModuleGroup(props: { data: {
  size: number,
  name: string
} }) {
  return (
    <div className="custom-node">
      <div
        className="relative outline-border outline-offset-8 outline-dashed outline-2 rounded-md p-4 w-[128rem] h-[16rem]"
        style={{
          width: `${12 + 12.6 * (props.data.size-1)}rem`
        }}
      >
        <p className="absolute -top-7 left-0 font-mono text-foreground/80 text-xs uppercase">{props.data.name}</p>
      </div>
    </div>
  );
}

function RouteComponent() {
  const params = Route.useParams();
    
  const project = useSuspenseQuery(teamQueries.getProject(params.project_slug));

  const roles = useSuspenseQuery(teamQueries.getRolesByProject(project.data.id??""));

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [graphOpen, setGraphOpen] = useState(true);

  const _theme = bStore.use.theme();

  useEffect(() => {
    let curRoles = roles.data.filter(r => !r.reportsTo);
    let newRoles: typeof roles.data = [];

    let level = 0;
    let edgeId = 0;
    let maxLevelLength = 0;

    let levelNodes: Node[][] = [];
    let edges: Edge[] = [];

    while (curRoles.length > 0) {
      if (curRoles.length > maxLevelLength)
        maxLevelLength = curRoles.length;

      newRoles = [];

      let thisLevelNodes: Node[] = [];

      curRoles.forEach((r, i) => {
        newRoles.push(...roles.data.filter(r2 => {
          if (r2.reportsTo === r.id) {
            edges.push({
              id: `e${edgeId++}`,
              source: r.id,
              target: r2.id
            });

            return true;
          }
        }));

        thisLevelNodes.push({
          id: r.id,
          position: { x: i * 200, y: 160 * level },
          data: { name: r.name, top: level === 0, id: r.id },
          type: "role-node",
          parentId: "imaging-module",
          extent: "parent"
        });
      });

      if (newRoles.length === 0) {
        thisLevelNodes = thisLevelNodes.map(n => ({ ...n, data: { ...n.data, bottom: true } }))
      }

      levelNodes.push(thisLevelNodes);

      level++;
      curRoles = newRoles;
    }

    levelNodes = levelNodes.map(l => (
      l.map(n => ({
        ...n,
        position: {
          y: n.position.y,
          x: n.position.x + (maxLevelLength - l.length) * 100
        }
      }))
    ));

    console.log(levelNodes);
    console.log(edges);

    setNodes([
      ...(levelNodes.flat()),
      { id: 'imaging-module', position: { x: 0, y: 0 }, data: { name: "Imaging Module", size: maxLevelLength }, type: "module-group" }
    ]);

    setEdges([
      ...edges
    ]);
  }, []);

  const userData = useAuthenticatedUser();

  return (
    <GenericPage
      title={`${project.data.acronym}`}
      headerContent={(
        <div className="flex flex-col gap-4">
          <p className="italic">
            The {project.data.name}
          </p>
          <p>
            {project.data?.description}
          </p>
          {userData?.user.role === "admin" &&
            <div className="w-full flex flex-row items-center gap-2">
              <Link to="/missions/edit/$project_slug" params={{ project_slug: project.data.acronym }}>
                <Button variant='outline'>
                  <Pencil />
                  Edit
                </Button>
              </Link>
            </div>
          }
        </div>
      )}
    >
      <div
        className={cn(
          "relative w-full transition-all duration-500 border border-border rounded-md",
          {
            "h-[5rem]": !graphOpen,
            "h-[30rem]": graphOpen
          }
        )}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            "role-node": RoleNode,
            "module-group": ModuleGroup
          }}
          proOptions={{ hideAttribution: true }}
          // fitView
        >
          <Background color={_theme !== "light" ? "var(--secondary)" : "#ccc"}/>
        </ReactFlow>
        <p className="absolute bottom-2 right-2 font-mono uppercase text-foreground/80 text-xs">Leadership structure</p>
      </div>
      <div className="absolute top-2 right-2 flex flex-row items-center">
          <Button variant='ghost' onClick={() => setGraphOpen(g => !g)}>
            {graphOpen ? (
              <X/>
            ) : (
              <ArrowDown />
            )}
          </Button>
      </div>
      <h2 className="mb-4">Roles</h2>
      {/* {roles.data?.map(r => (
        r.name
      ))} */}
    </GenericPage>
  );
}
