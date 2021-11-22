import { characterNamesByTag } from '$lib/pixiv/tag';

describe('Character names captured by tag recognition', () => {
    test("Beidou's name is captured", () => {
        const tagStr = "#原神#女の子#肩甲骨#背中#北斗#beidou";
        const expected = [ 'Beidou' ];
        expect(characterNamesByTag(tagStr)).toEqual(expect.arrayContaining(expected));
    });
    test("Multiple names are captured 1", () => {
        const tagStr = "#原神#枫原万叶#楓原万葉(原神)#kazuha#楓原万葉#北斗(原神)#Beidou";
        const expected = [ 'Beidou', 'Kazuha' ];
        expect(characterNamesByTag(tagStr)).toEqual(expect.arrayContaining(expected));
    });
    test("Multiple names are captured 2", () => {
        const tagStr = "#ユーラ#原神#尻神様#尻#优菈#Eula#GenshinImpact#ショートパンツ#yoimiya";
        const expected = [ 'Eula', 'Yoimiya' ];
        expect(characterNamesByTag(tagStr)).toEqual(expect.arrayContaining(expected));
    });
});
