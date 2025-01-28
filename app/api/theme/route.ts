import { cookies } from "next/headers";

export async function GET(_: Request) {
    const cookieStore = await cookies();
    const res = cookieStore.get('theme');

    return Response.json({
        theme: res?.value??'dark'
    });
}

export async function POST(request: Request) {
    const data = await request.json();

    if (data.theme !== 'dark' && data.theme !== 'light')
        return;

    const cookieStore = await cookies();
    cookieStore.set('theme', data.theme);
}