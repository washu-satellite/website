import Image from 'next/image';

// @ts-ignore
import cubeSat from "../app/cube.svg";

type DividerProps = {
    cube?: boolean
}

export default function Divider(props: DividerProps) {
    return props.cube ? (
        <div className="flex flex-row items-center justify-center gap-8">
            <div className={`h-[2px] w-full max-w-[10rem] bg-text-alt`}/>
            <Image src={cubeSat.src} alt={""} width={30} height={30}/>
            <div className={`h-[2px] w-full max-w-[10rem] bg-text-alt`}/>
        </div>
    ) : (
        <div className={`h-[2px] w-full bg-text-alt`}/>
    );
}