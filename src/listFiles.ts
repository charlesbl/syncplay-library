import fs from "fs";
import { join } from "path";

type Element = Folder | string;
interface Folder {
    name: string;
    files: Element[];
}

export default function listAllFiles(rootFolder: string, rootLink: string, password: string): string {
    return listLinks(getFolder(rootFolder, "."), rootLink, password);
}

function getFolder(path: string, folder: string): Folder {
    const fullPath = join(path, folder)
    const filesAndFolders = fs.readdirSync(fullPath, { withFileTypes: true });
    const result: Folder = {
        name: folder,
        files: []
    };
    const files: string[] = filesAndFolders.filter(f => f.isFile()).map(f => f.name);
    const folders: Folder[] = filesAndFolders.filter(f => !f.isFile()).map(f => getFolder(fullPath, f.name));
    result.files.push(...folders);
    result.files.push(...files);
    return result;
}

function listLinks(folder: any, root: string, password: string): string {
    if (typeof folder === "string") {
        return `${root}/${folder}?secret=${password}<br>`;
    } else {
        let result = "";
        folder.files.forEach((element: any) => {
            const f = folder.name === "." ? root : `${root}/${folder.name}`
            result += listLinks(element, f, password);
        });
        return result;
    }
}