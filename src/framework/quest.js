import React from 'react';
import ReactMarkdown from 'react-markdown';
import Store from "es6-store/src/Store";
import dedent from "dedent";
import {Link} from "react-router-dom";
import IoHome from "react-icons/lib/io/home";
import IoRefresh from "react-icons/lib/io/refresh";
import IoPlusCircled from "react-icons/lib/io/plus-circled";
import IoMinusCircled from "react-icons/lib/io/minus-circled";


class QuestInterface {
    constructor(basePath = "", storeName = "__global") {
        this.store = new Store(storeName);
        this.basePath = basePath
    }

    /** @abstract */
    reset() {
    }

    /** @abstract */
    getLocation() {
    }

    goTo(name, skipCount) {
        this.store.set(
            '__prev_location',
            this.store.get('__location'));
        this.store.set('__location', name);

        if (!skipCount) {
          let countVar = 'count_' + name;
          this.store.set(
              countVar,
              this.store.get(countVar, 0)+1);
        }
    }

    link(props) {
        if (props.href[0] === '#') {
            return <Link to={{
                pathname: this.basePath,
                state: {locName: props.href.slice(1)},
                title: props.title
            }}>{ props.children[0] }</Link>
        } else {
            return <a href={ props.href } target="_blank" rel="noopener noreferrer">{ props.children[0] }</a>
        }
    }

    md(source) {
        return <ReactMarkdown source={ dedent(source) } renderers={{ link: this.link.bind(this) }}/>
    }

    safeMd(source) {
        if (typeof source === "string") {
            return this.md(source)
        } else {
            return source;
        }
    }
}


export class QuestWord extends QuestInterface {
    maxZoom = 1.5;
    minZoom = 0.3;
    zoomStep = 0.1;

    /** @abstract
     * @returns string */
    get startQuestName() {
        return 'quest';
    };

    /** @abstract
     * @returns Object */
    getQuests() {
    };

    constructor(basePath = "", storeName = "__global") {
        super(basePath, storeName);
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

        if (quest === undefined) {
            loc = this.err404()
        } else {
            loc = quest.getLocation();
        }

        if (loc === undefined) {
            loc = this.err404()
        }

        let zoom = this.store.get('__zoom', 1);
        let rootStyle = document.getElementById('root').style;
        rootStyle.transform = `scale(${ zoom })`;
        rootStyle.width = (100 / zoom).toString() + '%';

        return (
            <div className={`contents ${curQuest} prev-${prevLocQuest}`}>
                <div className="toolbar">
                    { this.safeMd(toolbar) }
                </div>
                <div className="location">
                    { this.safeMd(loc) }
                </div>
            </div>
        )
    }

    getToolbar(main = 'Main', reset='Reset', zoomUp='Zoom Up', zoomDown='Zoom Down') {
        let homeLink;
        let resetLink = this.link({'href': '#__reset', 'title': reset, 'children': [<IoRefresh/>]});
        let zoomUpLink = this.link({'href': '#__font_up', 'title': zoomUp, 'children': [<IoPlusCircled/>]});
        let zoomDownLink = this.link({'href': '#__font_down', 'title': zoomDown, 'children': [<IoMinusCircled/>]});

        if (this.startQuestName === this.store.get('__cur_quest', this.startQuestName)) {
            homeLink = '';
        } else {
            homeLink = this.link({'href': '#__main', 'title': main, 'children': [<IoHome/>]})
        }

        return (
            <span>
                <span className='left'>{ zoomUpLink } {zoomDownLink}</span>
                <span>&nbsp;</span>
                <span className='right'>{ homeLink } { resetLink }</span>
            </span>
        );
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

    goTo(name, skipCount) {
        if (skipCount === undefined
                && this.store.get('__cur_quest') === this.startQuestName
                && name === this.store.get('__resume_loc')) {
            skipCount = true;
        }

        if (name === '__reset') {
            this.reset();
            return
        }
        if (name === '__main') {
            this.goToMain();
            return
        }
        if (name === '__font_up') {
            this.changeFont();
            return
        }
        if (name === '__font_down') {
            this.changeFont(false);
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
        quest.goTo(location, skipCount);
        super.goTo(this.store.get('__cur_quest')+':'+location, skipCount);
    }

    goToMain() {
        let curLoc = this.store.get('__location');
        this.store.set('__resume_loc', curLoc);

        if (curLoc !== undefined) {
            this.goToStart();
        }
    }

    err404() {
        return this.md(`
            ${this.store.get('__location')} is missing.

            [Go Back](#${this.store.get('__prev_location')})

        `)
    }

    changeFont(up=true) {
        let zoom = this.store.get('__zoom', 1);

        zoom = zoom + (up? this.zoomStep: -this.zoomStep);
        this.store.set(
            '__zoom',
            Math.max(
                this.minZoom,
                Math.min(zoom, this.maxZoom)
            )
        );
    }
}


export class MDQuest extends QuestInterface {
    startLoc = 'start';

    constructor(basePath = "", storeName = "__global", globalStore = null) {
        super(basePath, storeName);
        if (globalStore === null) {
            this.globalStore = this.store;
        } else {
            this.globalStore = globalStore;
        }
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
        return this.safeMd(loc);
    }

    switch(locations, name) {
        if (name === undefined) {
            let locName = this.store.get('__location', '');
            name = "count_"+locName;
        }

        let locName;
        let num = this.store.get(name, 1) - 1;

        if (num < locations.length) {
            locName = locations[num];
        } else {
            locName = locations[locations.length-1]
        }

        return this[locName]();
    }

    carousel(choices) {
        let name = this.store.get('__location', '');
        let num = (this.store.get("count_"+name, 0)) % choices.length;
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
