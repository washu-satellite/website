import { ThemeColors } from "@/const/theme";
import * as fs from 'fs';

const genTargets = [
    "text",
    "hover:text",
    "bg",
    "hover:bg"
]

const execute = () => {
    let out = "";

    Object.entries(ThemeColors).forEach(k => {
        const [_, v] = k;

        Object.entries(v).forEach(x => {
            const [_, str] = x;

            genTargets.forEach(t => {
                out += `${t}-[${str}] `;
            });
        });
    });

    const content = `export default function GeneratedStyles() { return (<div className={"hidden ${out}"}></div>) }`;

    fs.writeFile("./components/GeneratedStyles.tsx", content, err => console.log(err));
};

execute();

export {};