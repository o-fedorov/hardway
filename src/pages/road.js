import {MDQuest} from "../framework/quest";


export class Road extends MDQuest {
    startLoc = 'доріжка0';

    доріжка0 = () => `
        Джура ступає стежкою. Над головою світить місяць, тихо дзюрчить річка.
        В яскравому місячному світлі дорогу видно, ніби вдень.

        Плескотять хвилі, серед річки з’являються дві тіні. Ба, та то ж річкові
        чорти! Як справдешні вершники, гарцюють на здоровезних сомах.
        Сказано ж — не риба, а чортів кінь.

        Соми підпливають до невеличкого острівця, чорти притримують їх за
        вуса, ніби вуздечку. Рибини круто повертають та спускаються під воду
        разом із вершниками, широченні хвилі б’ють об берег.

        Ще мить — і річка стає спокійною.

        [Далі](#доріжка_нявка)
    `;


    доріжка_нявка = () => `
        ${ this.gset("статус_нявка", 1) }
        ${ this.set("нявка", "дівка") }
        Не встиг джура і пари кроків ступити, як залунав дзвінкий сміх. На
        на березі з’являється дівоча постать — простоволоса, нага,
        волосся роспустила, як дівка з шинка. Джура їй:
        
        — Ти хто?!

        А та передражнює:
        
        — Ти хто! Ти хто? Ти хто!

        Знай собі, дражниться, та до джури підбирається. А за нею — ні сліду,
        ні тіні...

        [Рушити далі](#доріжка_нявка0)

        [Повернутися](#доріжка_двір)
    `;


    доріжка_двір = () => `
        Зметикував джура, що до чого, та й повертає у двір.

        Дивиться краєм ока — дівка за ним біжить. Джура швидше, а вона
        не відстає. Та так припустилася, що й конем не обскачеш.

        Стрибнув джура через перелаз, обертається — а дівки як не бувало.
        Не наважилась, либонь, у домовикове господарство лізти.

        Зрозумів джура, що то не дівка до нього причепилася, а нявка.
        ${ this.set("нявка", "нявка") }
        [Далі](#yard:двір)
    `;


    доріжка1 = () => `
        Виходить парубок на стежку, а нявка вже його підстерігає, сміється та
        дражниться.

        — Йди-но сюди, — каже, — я тебе зігрію, обійму за шию!

         Йде, а з волосся на землю вода ллється.

        [Рушити далі](#доріжка_нявка0)

        [Повернутися](#yard:двір)
    `;


    доріжка_нявка0 = () => `
        Ступив джура ще крок, а ${ this.get("нявка", 'та') } до нього
        підскакує, та як схопить!

        — Любисток чи петрушка?! — говорить.

        Сіпнувся джура в один бік, у інший — не вирватись.
        ${
            (this.get("count_доріжка1") === 0)
            ? "Зрозумів, що не до кого-небудь, а до нявки у лапи потрапив."
            : ""
        }

        [Любисток](#любисток)

        [Петрушка](#петрушка)

        ${
            (this.gget("статус_домовик") > 1)
            ? "[Веретено](#веретено)"
            : ""
        }
    `;


    петрушка = () => `
        — Петрушка! — говорить джура.

        — Ох ти моя душка! — промовляє нявка.

        Збагнув джура, що не ті слова сказав...

        [. . .](#ending:parsley)
    `;



    любисток = () => `
        — Любисток! — говорить джура.

        Тут-то нявка скривилася, руки послабшали. Джура й оком не встиг
        кліпнути, як утекла — та так хутко, що й стріла не дожене.

        Лиш біля берега обернулася.
        
        — Заткнув би ти свій писок! — кричить.

        Мить — і зникла у воді.

        [Далі](#доріжка_нявки)
    `;


    веретено = () => `
        — А ось що, — говорить джура.

        Та як ткне її веретеном, нявка і згинула — лиш мокре місце лишилося.

        [Далі](#доріжка_нявки)
    `;


    доріжка_нявки = () => `
        ${ this.gset("статус_нявка", 2) }
        Підходить юнак до лісу.

        Річка тут вигинається, веде круто вбік, і доріжка услід за нею.
        А джурі-бо навпростець треба!

        До турбот, та ще й лихо: на галявині, що коло річки, нявки зібрались.
        Котрі витанцьовують та гаївки співають, інші по деревах на гілках
        сидять, волосся розчісують — вода так і тече. А декотрі квіти збирають
        та вінки плетуть.

        Майнула у джури думка, що такі як накинуться — не спитають, як звали!

        [На галявину](#нявки)

        [Повернутися у двір](#yard:двір)

        ${
            (this.gget("статус_домовик") > 1)
            ? `[До лісу](#forest:ліс${ this.gget("статус_ліс", 0)})`
            : ""
        }
    `;


    нявки = () => `
        Ступає джура на галявину, так нявки одразу ж свої справи полишають.

        — Фу, — каже одна, — живими пахне, чи що?

        — Та ні, сестро, — каже друга, — то парубок не мився давно.
        Затягнімо його у воду, хай покисне!

        — Краще полоскочімо його, — каже третья. — Розсміється —
        живий. А як відсміється — не живий, значить...

        [. . .](#ending:niavki)
    `;


    доріжка2 = () => `
        Доріжка йде через галявину, де нявки водять хороводи. Там би джурі
        і пройти, та лоскотухи живих на дух не переносять.

        [На галявину](#нявки)

        [Повернутися у двір](#yard:двір)

        ${
            (this.gget("статус_домовик") > 1)
            ?  `[До лісу](#forest:ліс${ this.gget("статус_ліс", 0) })`
            : ""
        }
    `;


    _btn_галявина = (skip_beregini) => `
        ${
            this.gget("чугайстер_танцював")
            ? ""
            : "[Повернутися у двір](#yard:двір)"
        }

        ${
            (this.gget("чугайстер_танцював") && !this.get("count_втомився_двір"))
            ? "[Повернутися у двір](#втомився_двір)"
            : ""
        }

        ${
            (!skip_beregini 
                && (
                    this.gget("статус_берегині") !== 0
                    ? "[До берегинь](#берегині1)"
                    : "[До дівчат](#берегині0)"
                )
            ) || ''
        }

        [До броду](#ford:брід${ this.gget("статус_брід", 0) })
    `;


    доріжка3 = () => `
        На галявині, що коло річки, тихо й спокійно, ані сліду від нявок.
        Ну, вони-то слідів ніколи не лишають.

        Далі на бережку сидить троє дівчат. На нявок не схожі: вдягнені у
        сорочки-вишиванки, волосся у коси заплетене. Сидять, вінки плетуть та
        розмови ведуть.

        ${ this["_btn_галявина"]() }
    `;


    доріжка_від_водяника = () => `
        — Тут подумати треба, — говорить джура та й назад повертає.
        
        ${ this["_btn_галявина"]() }
    `;


    доріжка4 = () => `
        ${ this.gset("статус_берегині", 1) }
        Стежина йде між лісом та річкою. На бережку сидять берегині та тихо
        бесідують.

        ${
            this.get("count_брід", false)
            ? this.set("десь_далі", "Десь далі має бути брід")
            : this.set("десь_далі", "Далі — брід і водяник")
        }

        ${ this.get("десь_далі", '') }. Лишилося річку перейти, а там до
        Січі рукою махнути.

        ${ this["_btn_галявина"]() }
    `;


    втомився_двір = () => `
        Глянув джура на стежку, що простягається до села, і такою вона йому
        довгою здалася! Ноги ж-бо втомилися від танцю. Хоч би на Січ
        дошкандибати, а як до села йти, та повертатися — жодних сил
        не вистачить!

        ${ this["_btn_галявина"]() }
    `;



    берегині0 = () => `
         Підходить парубок до дівчат.

        — Здрастуйте, сестри, — говорить. — Чи немає тут нявок?

        — І тобі доброго здоров’ячка, — говорить одна дівчина.

        — Нема нявок, — говорить друга. — Були — та й загули. Тих, що на
        галявині збирались, Чугайстер розігнав. А котрі втекти не встигли,
        тих розірвав на шматочки.

        — А тут, на нашому бережку, — каже третя, — нявок зроду не було.

        [Далі](#берегині_говорити)
    `;



    берегині_говорити = () => `
        ${ this.gset("статус_нявка", 4) }
        — А хто ж ви такі? — говорить джура.

        — Не впізнав, либонь? Берегині ми! — промовляє перша.

        — На бережку сидимо, щоб таких, як ти, із води витягати, — говорить
        друга.

        — Під селом — опирева вотчина, а тут наші землі починаються, —
        говорить третя.

        Тут парубок вклонився їм.

        — Мир вам, берегині!

        — І тобі, — говорять, — джура, учень характерника. Щасти тобі на шляху.

        [Далі](#доріжка4)
    `;



    берегині1 = () => `
        Підходить парубок до берегинь, кланяється.

        — Мир вам, берегині!

         А ті йому кивають.

        — І тобі, джура, учень характерника, — говорять.

        ${
            (!this.get("count_берегині_загадка") && this.gget("загадка"))
            ? "[Спитати про загадку](#берегині_загадка)"
            : ""
        }

        [Далі](#доріжка4)
    `;



    берегині_загадка = () => `
        ${ this.gset("берегині_загадка", true) }
        — Сестри берегині! — говорить джура. — Допоможіть, будь ласка, загадку
        розгадати:

        "${ this.gget("загадка") }"

        — Що ж це ти надумав загадки загадувати? — говорить одна з берегинь.

        [Далі](#берегині_загадка1)
    `;


    берегині_загадка1 = () => `
        — Це мені водяник задав, — промовляє парубок, — щоб дозволив
        брід перейти.

        — То йди до водяника, — говорить друга берегиня, — і скажи, що як
        не пускатиме чесних людей на брід, ми йому всі вири мулом засипемо,
        всі неводи порвемо, отару його водяну аж у Дніпро відженемо!

        — Так і передай, — додає третя.

        ${ this["_btn_галявина"](true) }
    `;
}
