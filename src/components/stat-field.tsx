import { cn } from "@/lib/utils"

export function StatField(props: {
    title: string,
    value: string,
    units?: string,
    small?: boolean
}) {
    return (
        <div className={cn(
            "flex flex-col",
            {
                "text-base" : !props.small
            }
        )}>
            <p className="uppercase font-mono text-xs text-foreground/60">{props.title}</p>
            {props.units ? (
                <p className="font-semibold">{props.value}<span className="text-base font-normal pl-1">{props.units}</span></p>
            ) : (
                <p className="font-semibold font-mono">{props.value}</p>
            )}
        </div>
    )
}