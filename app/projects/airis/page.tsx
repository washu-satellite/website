import ProjectPage from "@/components/ProjectPage";
import Image from "next/image";

export default function AIRIS() {
    return (
        <ProjectPage
            title={
                <Image
                    src={"/projects/airis.svg"}
                    alt={""}
                    width={1000}
                    height={200}
                />
            }
        >
            
        </ProjectPage>
    )
}