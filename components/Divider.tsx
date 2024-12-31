import { getColors } from "@/const/theme"

export default function Divider() {
    const colors = getColors();

    return (
        <div className={`h-[2px] w-full bg-[${colors.textAlt}]`}/>
    );
}