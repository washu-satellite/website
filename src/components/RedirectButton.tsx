import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function RedirectButton(props: {
    text: string,
    href: string
}) {
    return (
        <Button variant='outline' asChild>
            <Link to={props.href} className="flex flex-row items-center gap-2 group">
                <span>{props.text}</span>
                <ArrowRight className="group-hover:translate-x-[6px] transition-transform duration-300"/>
            </Link>
        </Button>
    )
}