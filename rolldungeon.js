/*
    usage: Type !rolldungeon into chat, and you will be presented with this randomly generated dungeon
    values taken from https://www.reddit.com/r/BehindTheTables/comments/4iq4of/basic_dungeons/
*/
const dungeonTypes = ['Stronghold','Temple','Tomb','Prison','Mine','Lair','Palace','Storage Vault','Sewer','Maze'];
const Archetects = ['Ancient Dwarvish Clan','Ancient Elf Prince','Powerful Wizard','Dard Sorceress','Foreign Empire','Ambbitious Queen of Old','Prosperous Merchants','Powerful Noble Family','Religious Zealots','Ancient Race of Giants','Tyrannical King Of Old','No One (Natural Cave)'];
const Locations = ['Mountain','Mountain Pass','Forest','Desert','Sea','Island','City','Castle','Monastery','Magic Portal'];
const LocationModifiers = ['Beneath', 'Deep within','Beside','On','Near','In'];
const BigOccupants = ['Dangerour Outlaw','Elemental Lord','Vampire','Lich','Demon','Devil','Orc Warlard','Hobgoblin Commander','Aberrant Presence','Witch','Giant','Dragon'];
const SmallerOccupants = ['Thieves','Goblins','Zombies','Skeletons','Bats','Rats','Spiders','Oozes','Kobolds','Cultists','Troglodytes','Ogres'];
const Mechanics = ['Gauntlet of mechanical traps','powerful magical wards','golem guardians','elemental guardians','noxious gas','tocis mold','horrible curse','unstable ceilings','flooding chambers','sink holes','steam vents and lava flows','slippery footing'];
const Rewards = ['Weapon','Wand','Spellbook','Treasure Stash','Hoard','Artifacts','Relics','Chests of Silver','Crown Jewels','Large Diamond']

const randomZeroBasedInt = max => randomInteger(max) - 1;
const randomFromList = list => list[randomZeroBasedInt(list.length)];
const rolls = () => { 
    return {
        dungeonType: randomFromList(dungeonTypes),
        archetect: randomFromList(Archetects),
        Location: randomFromList(Locations),
        LocationModifier: randomFromList(LocationModifiers),
        Boss: randomFromList(BigOccupants),
        Minions: randomFromList(SmallerOccupants),
        dungeonMechanic: randomFromList(Mechanics),
        Reward: randomFromList(Rewards),
    };
};
function speakRolls(rs, title){
    const titleOrDefault = title || "No Title"
    function SplitUpperCase(value){
        return value.replace(/(?!^)([A-Z]|\d+)/g, " $1");
    }
    const ms = _.map(rs, (value, key, list) => `{{${SplitUpperCase(key)}=${value}}}`);
    const fm = _.reduce(ms, (memo, value) => memo +  value, ``);
    const t = `&{template:default}{{name=${titleOrDefault}}}${fm}`
    sendChat('', t);
}
const feature = {
    rolldungeon: () => {
        let rs = rolls();
        speakRolls(rs, "Roll Dungeon");
        return rs;
    },
};

function isAPIMessage(msg){
    return 'api' === msg.type;
}
function isValidFeature(f){
    return f in feature;
}

function onMsg (msg){
    if(isAPIMessage(msg)){
        const fn = msg.content.replace('!', '');
        if(isValidFeature(fn)){
            const value = feature[fn]();    
            log(value);
        }
    }
}

on('ready', () => on('chat:message', onMsg));
