import { ArrowButton } from "./Button";

type RedirectCardProps = {
    href: string;
    buttonText: string;
    title: string;
}

export default function RedirectCard(props: RedirectCardProps) {
    return (
        <div className={`flex font-mono flex-col items-center gap-8 justify-center bg-fg border-bg-highlight border-[1px] p-8 rounded-md`}>
            <h1 className={`text-text-dark font-medium text-xl`}>{props.title}</h1>
            <ArrowButton text={props.buttonText} href={props.href}/>
        </div>
    )
}