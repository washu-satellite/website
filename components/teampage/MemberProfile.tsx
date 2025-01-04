import Photo from "../Photo";


type MemberProfileProps={
    name: string,
    discipline: string,
    src: string
}

export default function MemberProfile(props: MemberProfileProps){
    return <Photo src={props.src}>
        <p>{props.name}</p>
        <p>{props.discipline}</p>
    </Photo>
}