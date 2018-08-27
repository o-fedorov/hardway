import React from "react";
import {MDQuest} from "../framework/quest";
import IoRefresh from "react-icons/lib/io/refresh";
import {share} from "./common";


export class Title extends MDQuest {
    startLoc = 'main';

    debug = () => {
        this.store.set("статус_домовик", 2);
        this.store.set("статус_нявка", 3);

        return `
        [двір](#yard:двір)
        [ліс](#forest:ліс0)
        [доріжка](#road:доріжка3)
        [брід](#ford:брід0)
        `
    };

    main = () => {
        let resumeLink = "";
        let resumeLoc = this.gget('__resume_loc', null);
        if (resumeLoc !== null) {
            resumeLink = (<div>
                { this.md( `[Продовжити](#${resumeLoc})` ) }
            </div>)
        }

        return (
            <div className="main-title">
                <div className="author">{ this.md( "[Олександр Федоров](#автор)" ) }</div>
                <div className="title-name"><b>Лиха Година</b></div>
                <div className="buttons">
                    <div>
                        { this.md( `[Почати${ resumeLink? " наново": "" }](#intro:вступ)` ) }
                    </div>
                    { resumeLink }
                    <div>
                        { this.md( "[Про автора](#автор)" ) }
                    </div>
                    <div>
                        { this.md( "[Поради](#поради)" ) }
                    </div>
                    <div>
                        { this.md( "[Примітки (Спойлери!)](#примітки)" ) }
                    </div>
                    <div>&nbsp;</div>
                    { share() }
                </div>
                <div className="license">
                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                        <img alt="Ліцензія Creative Commons" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
                    </a>
                    <br />
                    Цей твір ліцензовано на умовах&nbsp;
                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                        Ліцензії Creative Commons Із Зазначенням Авторства — Поширення На Тих Самих Умовах 4.0 Міжнародна
                    </a>.
                </div>
            </div>);
    };


    поради = () => (<span>`
        <div>Поради до гри:</div>
        
        <div>
            1. Ви можете закрити гру будь-якої миті та повернутися до неї пізніше.
               Коли ви повторно відкриєте гру в тому ж браузері, вона почнеться
               з того місця, на якому ви закінчили.
        </div>
           
        <div>
            2. Щоб почати заново, або натисніть "&nbsp;{<IoRefresh/>}"
               ("Скинути") у правому верхньому кутку, або перейдіть на
               головну сторінку та натисніть "Почати".
        </div>

        <div>
            3. У гри кілька закінчень, хоч лише три з них — хороші. Зважайте на
               попередження, щоб не закінчити передчасно.
        </div>

        <div>
            { this.md( "[На головну](#main)" ) }
        </div>
        </span>
    );


    примітки = () => `
        **Обережно!** В тексті є спойлери! Якщо ви ще не пройшли гру, далі не
        читайте.
        
        Міфічні персонажі оповідання прийшли з енциклопедій,
        із повісті М. Коцюбинського "Тіні забутих предків", і ще трохи із
        "Хронік Амбера" Р. Желязни — що, звісно, до українського фольклору 
        не має жодного стосунку. Ще трохи приплелися особисті 
        спостереження та узагальнення.
        
        Тож розцінюйте цей твір більш як художній. Ось найбільш 
        суттєві неточності:
        
        1. Жабою, скоріш за все, могла бути відьма, а не бісиця. Але на
        відьму веретено б не подіяло, бо вона не належить до так званих
        "низьких духів".
        
        2. Водяник навряд чи буде загадувати загадки — це більш притаманне
        грайливим духам, таким, як нявка чи лісовик.
        
        [1/2 >](#примітки1)
 
        [На головну](#main)
    `;



    примітки1 = () => `
        3. Домовик не так легко йде на контакт і не настільки балакучий.
        
        4. "Зметикувати на трьох" — радянська традиція, і до української
        культури відноситься опосередковано.
        
        
        Іще, хотілося б зауважити:
        
        1. Проти нечесті допомагає не лише веретено, а й інші знаряддя праці:
        сокира, ніж, батіг. До речі, вони діють і на добрих духів, таких як
        домовик і Чугайстер.
        
        2. Опир = упир. Не плутати з вампірами, вурдалаками і графом
        Дракулою.

        [< 2/2](#примітки)
        
        [На головну](#main)
    `;


    автор = () => `
        ● Підписатися на [Facebook](https://www.facebook.com/FedorovOleksandr) 
        або [Instagram](https://www.instagram.com/oleksandrfedorovblog/).

        ● Читати на [libera.store](https://libera.store/uk/author/279)
        або [пригостити кавою](https://libera.store/uk/author/book/34).

        ● Підтримати на [Patreon](https://www.patreon.com/ofedorov).

        ● Вихідний текст гри на [GitHub](https://github.com/Fedorof/hardway).
        
        [Назад](#main)
    `;
}