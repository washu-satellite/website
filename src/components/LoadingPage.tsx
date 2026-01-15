import { Spinner } from "./ui/spinner";

export default function LoadingPage() {
    return (
        <div className="w-full h-screen flex flex-row items-center justify-center gap-2 text-foreground/80">
            <Spinner /> <p>Loading...</p>
        </div>
    )
}