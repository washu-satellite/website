import RedirectButton from "./RedirectButton";

type RedirectCardProps = {
    href: string;
    buttonText: string;
    title: string;
}

export default function RedirectCard(props: RedirectCardProps) {
    return (
        <div className={`flex flex-col items-center gap-8 justify-center bg-secondary/30 border-border border p-8 rounded-md`}>
            <h1 className={`font-mono text-foreground font-medium text-xl`}>{props.title}</h1>
            <RedirectButton text={props.buttonText} href={props.href}/>
        </div>
    )
}