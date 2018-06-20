import React from 'react';
import ReactMarkdown from 'react-markdown';
import Store from "es6-store/src/Store";
import dedent from 'dedent';


class QuestInterface {
    constructor(storeName) {
        if (storeName === undefined) {
            storeName = "__global"
        }
        this.store = new Store(storeName);
    }

    /** @abstract */
    reset() {
    }

    /** @abstract */
    getLocation() {
    }

    goTo(name) {
        let countVar = 'count_' + name;
        this.store.set(
            '__prev_location',
            this.store.get('__location'));
        this.store.set('__location', name);
        this.store.set(
            countVar,
            this.store.get(countVar, 0)+1);
    }
}


export class QuestWord extends QuestInterface {
    /** @abstract
     * @returns string */
    get startQuestName() {
    };

    /** @abstract
     * @returns Object */
    getQuests() {
    };

    constructor() {
        super();
        this.quests = this.getQuests();
    }

    getQuest() {
        let questName = this.store.get('__cur_quest');

        if (questName === undefined) {
            questName = this.startQuestName;
            this.goToStart();
        }

        return this.quests[questName]
    }

    getLocation() {
        let loc;
        let quest = this.getQuest();
        let curQuest = this.store.get('__cur_quest', this.startQuestName);
        let prevLocQuest = this.store.get('__prev_loc_quest', '');
        let toolbar = this.getToolbar();

        if (typeof toolbar === "string") {
            toolbar = <ReactMarkdown source={ dedent(toolbar) } />
        }

        if (quest === undefined) {
            loc = this.err404()
        } else {
            loc = quest.getLocation();
        }

        if (loc === undefined) {
            loc = this.err404()
        }

        return (
            <div className={`contents ${curQuest} prev-${prevLocQuest}`}>
                <div className="toolbar">
                    { toolbar }
                </div>
                <div className="location">
                    { loc }
                </div>
            </div>
        )
    }

    getToolbar() {
        return `${
            this.startQuestName !== this.store.get('__cur_quest', this.startQuestName)
                ? "[Main](#__main)"
                : ""
        }
        [Reset](#__reset)`;
    }

    reset() {
        for (let quest of Object.values(this.quests)) {
            quest.reset();
        }
        this.store.clear();
        this.goToStart();
    }

    goToStart() {
        let startQuestName = this.startQuestName;
        this.store.set('__cur_quest', startQuestName);
        this.store.set('__prev_quest', '');
        this.store.set('__prev_loc_quest', '');
    }

    goTo(name) {
        if (name === '__reset') {
            this.reset();
            return
        }
        if (name === '__main') {
            this.goToMain();
            return
        }

        let quest;
        let [questName, location] = name.split(/:(.+)/, 2);
        let curQuest = this.store.get('__cur_quest', '');
        this.store.set('__prev_loc_quest', curQuest);

        if (location === undefined) {
            location = questName;
        } else {
            this.store.set('__prev_quest', curQuest);
            this.store.set('__cur_quest', questName);
        }

        quest = this.getQuest();
        quest.goTo(location);
        super.goTo(this.store.get('__cur_quest')+':'+location);
    }

    goToMain() {
        let curLoc = this.store.get('__location');
        this.store.set('__resume_loc', curLoc);

        if (curLoc !== undefined) {
            this.goToStart();
        }
    }

    err404() {
        return <ReactMarkdown source={ dedent`
            ${this.store.get('__location')} is missing.

            [Go Back](#${this.store.get('__prev_location')})

        ` } />
    }

}


export class MDQuest extends QuestInterface {
    startLoc = 'start';

    constructor(globalStore, storeName) {
        super(storeName);
        this.globalStore = globalStore;
    }

    reset() {
        this.store.clear();
    }

    getLocation() {
        let locName = this.store.get('__location', this.startLoc);

        if (this[locName] === undefined) {
            return undefined;
        }

        let loc = this[locName]();

        if (typeof loc === "string") {
            return <ReactMarkdown source={dedent(loc)}/>
        } else {
            return loc
        }
    }

    carousel(name, choices) {
        let num = (this.store.get(name, 0)+1) % choices.length;
        this.store.set(name, num);
        return choices[num];
    }

    rnd(choices) {
        return choices[Math.floor(Math.random()*choices.length)];
    }

    get(name, defaultValue=0) {
        return this.store.get(name, defaultValue)
    }

    set(name, value) {
        this.store.set(name, value);
        return ""
    }

    gget(name, defaultValue=0) {
        return this.globalStore.get(name, defaultValue)
    }

    gset(name, value) {
        this.globalStore.set(name, value);
        return ""
    }
}