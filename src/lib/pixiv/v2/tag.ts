import name_map from '$lib/names.json';

const rgx = buildNamesRegex();

export function characterNamesByTag(tagStr: string): string[] {
    const tagList = tagStr.split('#');
    const characters: string[] = [];
    for (const tag of tagList) {
        const results = [...tag.matchAll(rgx)];
        for (const result of results) {
            for (const key in result.groups) {
                if (result.groups[key]) {
                    characters.push(key);
                }
            }
        }
    }
    return characters;
}

function buildNamesRegex(): RegExp {
    const rgxStrList = [];
    for (const name in name_map) {
        const names = name_map[name]['name'].concat(name_map[name]['regex']);
        const joinedNames = names.join('|');
        const rgxStr = `(?<${name}>${joinedNames})`;
        rgxStrList.push(rgxStr);
    }
    const joinedNames = rgxStrList.join('|');
    // ".*(?:(?<Ayaka>Ayaka|神里绫华|Kamisato.*Ayaka)|(?<Beidou>Beidou|北斗)).*"
    const rgxStr = `.*(?:${joinedNames}).*`;
    const rgx = new RegExp(rgxStr, 'gi');
    return rgx;
}
